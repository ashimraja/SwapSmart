import express from 'express';
import auth from '../middleware/auth.js';
import pool from '../config/db.js';
import Stripe from 'stripe';
import adminAuth from '../middleware/adminAuth.js';
import nodemailer from 'nodemailer';

const orderRoutes = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = 'inr';
const deliveryCharge = 50;

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Notifies seller when their phone is sold
 * @param {number} productId - ID of the sold phone
 * @param {number} orderId - ID of the new order
 * @param {number} amount - Sale price of the phone
 */
const notifySeller = async (productId, orderId, amount) => {
  try {
    // Get seller email and product details
    const productQuery = await pool.query(
      `SELECT u.email, u.name as seller_name, p.phone_name, p.model 
       FROM phones_for_sale p
       JOIN users u ON p.sold_by_user_id = u.id
       WHERE p.id = $1`,
      [productId]
    );

    if (productQuery.rows.length === 0) {
      console.error('Product not found for notification');
      return;
    }

    const { email, seller_name, phone_name, model } = productQuery.rows[0];

    // Create email content
    const mailOptions = {
      from: `"Phone Marketplace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Your Phone Has Been Sold!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Congratulations ${seller_name}!</h1>
          <p>Your ${phone_name} ${model} has been sold for <strong>₹${amount.toLocaleString('en-IN')}</strong>.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Order Details</h2>
            <p><strong>Order ID:</strong> #${orderId}</p>
            <p><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
          </div>
          
          <p style="margin-top: 20px;">
            The payment will be processed and transferred to your account within 3-5 business days.
          </p>
          
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/seller/orders" 
               style="background: #4CAF50; color: white; padding: 10px 15px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              View Order Details
            </a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to seller for order ${orderId}`);
  } catch (error) {
    console.error('Error sending seller notification:', error);
  }
};

// PLACE ORDER - COD
orderRoutes.post('/place', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { productId, amount, address } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // 1. Create the order
    const orderData = {
      user_id: userId,
      product_id: productId,
      address,
      amount,
      payment_method: 'COD',
      payment: false
    };

    const newOrder = await client.query(
      `INSERT INTO orders (user_id, product_id, address, amount, payment_method, payment)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [orderData.user_id, orderData.product_id, orderData.address, 
       orderData.amount, orderData.payment_method, orderData.payment]
    );

    // 2. Mark phone as sold
    await client.query(
      'UPDATE phones_for_sale SET is_available = false WHERE id = $1',
      [productId]
    );

    // 3. Send notification to seller
    await notifySeller(productId, newOrder.rows[0].id, amount);

    await client.query('COMMIT');

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully. Seller has been notified.',
      order: newOrder.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('COD Order Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to place order',
      error: error.message 
    });
  } finally {
    client.release();
  }
});

// PLACE ORDER - STRIPE
orderRoutes.post('/stripe', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { productId, amount, address } = req.body;
    const { origin } = req.headers;
    const userId = req.user.id;

    await client.query('BEGIN');

    // 1. Create order record
    const newOrder = await client.query(
      `INSERT INTO orders (user_id, product_id, address, amount, payment_method, payment)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, productId, address, amount, 'Stripe', false]
    );

    // 2. Mark phone as sold
    await client.query(
      'UPDATE phones_for_sale SET is_available = false WHERE id = $1',
      [productId]
    );

    // 3. Prepare Stripe payment
    const line_items = [{
      price_data: {
        currency,
        product_data: {
          name: 'Mobile Phone Order'
        },
        unit_amount: Math.round(amount * 100) // Convert to paise
      },
      quantity: 1
    }, {
      price_data: {
        currency,
        product_data: {
          name: 'Delivery Charges'
        },
        unit_amount: deliveryCharge * 100 // Convert to paise
      },
      quantity: 1
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/verify?success=true&orderId=${newOrder.rows[0].id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder.rows[0].id}`,
    });

    // 4. Send notification to seller
    await notifySeller(productId, newOrder.rows[0].id, amount);

    await client.query('COMMIT');

    res.json({ 
      success: true, 
      session_url: session.url 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Stripe Order Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed',
      error: error.message 
    });
  } finally {
    client.release();
  }
});

// VERIFY STRIPE PAYMENT
orderRoutes.post('/verifyStripe', auth, async (req, res) => {
  try {
    const { orderId, success } = req.body;
    
    if (success === 'true') {
      // Verify and complete payment
      await pool.query(
        'UPDATE orders SET payment = true WHERE id = $1',
        [orderId]
      );
      
      res.json({ success: true });
    } else {
      // On payment failure, delete the order and make phone available again
      const order = await pool.query(
        'DELETE FROM orders WHERE id = $1 RETURNING product_id',
        [orderId]
      );
      
      if (order.rows.length > 0) {
        await pool.query(
          'UPDATE phones_for_sale SET is_available = true WHERE id = $1',
          [order.rows[0].product_id]
        );
      }
      
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed',
      error: error.message 
    });
  }
});

// GET ALL ORDERS (ADMIN ONLY)
orderRoutes.get('/list', adminAuth, async (req, res) => {
  try {
    const orders = await pool.query(`
      SELECT o.*, 
             u.name as buyer_name, u.email as buyer_email,
             p.phone_name, p.model, p.price,
             seller.name as seller_name, seller.email as seller_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN phones_for_sale p ON o.product_id = p.id
      JOIN users seller ON p.sold_by_user_id = seller.id
      ORDER BY o.created_at DESC
    `);
    
    res.json({ 
      success: true, 
      orders: orders.rows 
    });
  } catch (error) {
    console.error('Admin Orders Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
});

// GET USER ORDERS (for buyers)
orderRoutes.get('/userorders', auth, async (req, res) => {
  try {
    const orders = await pool.query(`
      SELECT o.*, p.phone_name, p.model, p.price, p.image,
             p.brand, o.status, o.created_at as order_date
      FROM orders o
      JOIN phones_for_sale p ON o.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    
    res.json({ 
      success: true, 
      orders: orders.rows 
    });
  } catch (error) {
    console.error('User Orders Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your orders',
      error: error.message 
    });
  }
});

// GET SELLER ORDERS (for sellers)
orderRoutes.get('/sellerorders', auth, async (req, res) => {
  try {
    const orders = await pool.query(`
      SELECT o.*, p.phone_name, p.model, p.price, p.image,
             u.name as buyer_name, o.status, o.created_at as order_date
      FROM orders o
      JOIN phones_for_sale p ON o.product_id = p.id
      JOIN users u ON o.user_id = u.id
      WHERE p.sold_by_user_id = $1
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    
    res.json({ 
      success: true, 
      orders: orders.rows 
    });
  } catch (error) {
    console.error('Seller Orders Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your sales',
      error: error.message 
    });
  }
});


// UPDATE ORDER STATUS (ADMIN ONLY)
orderRoutes.put('/status', adminAuth, async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const updatedOrder = await pool.query(
      `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, orderId]
    );
    
    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Status updated',
      order: updatedOrder.rows[0] 
    });
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status',
      error: error.message 
    });
  }
});

// UPDATE ORDER STATUS
orderRoutes.put('/status', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { orderId, status } = req.body;
    
    // First verify the user has permission to update this order
    // (either admin or the seller of the product)
    const orderCheck = await client.query(
      `SELECT o.id, p.sold_by_user_id 
       FROM orders o
       JOIN phones_for_sale p ON o.product_id = p.id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user is admin OR the seller of this product
    const isAdmin = req.user.role === 'admin';
    const isSeller = orderCheck.rows[0].sold_by_user_id === req.user.id;
    
    if (!isAdmin && !isSeller) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to update this order status' 
      });
    }

    // Update the status
    const updatedOrder = await client.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [status, orderId]
    );

    res.json({ 
      success: true, 
      message: 'Status updated successfully',
      order: updatedOrder.rows[0] 
    });

  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status',
      error: error.message 
    });
  } finally {
    client.release();
  }
});

export default orderRoutes;