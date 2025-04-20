import express from 'express';
import pool from '../config/db.js';
import adminAuth from '../middleware/adminAuth.js';

const phoneRoutes = express.Router();

// Create phone listing
phoneRoutes.post('/', async (req, res) => {
  try {
    const {
      brand,
      phoneName,
      model,
      price,
      firstHandPrice,
      description,
      ram,
      rom,
      city,
      state,
      zipcode,
      country,
      phone,
      images, // Changed from 'image' to 'images' to match frontend
      userId // Added user ID
    } = req.body;

    // Ensure images is an array (frontend sends as 'images')
    const imageArray = Array.isArray(images) ? images : [];

    if (!brand) {
      return res.status(400).json({ success: false, message: 'Brand is required' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const query = `
      INSERT INTO phones_for_sale 
      (brand, phone_name, model, price, first_hand_price, description, ram, rom, city, state, zipcode, country, phone, image, sold_by_user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;

    const values = [
      brand,
      phoneName,
      model,
      price,
      firstHandPrice || null, // Handle optional field
      description,
      ram,
      rom,
      city,
      state,
      zipcode,
      country,
      phone,
      imageArray,
      userId // Include user ID
    ];

    const result = await pool.query(query, values);

    res.json({ 
      success: true, 
      message: 'Phone posted successfully!',
      phone: result.rows[0]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while posting the phone.',
      error: error.message
    });
  }
});


// Get all available phones
phoneRoutes.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM phones_for_sale WHERE is_available = $1',
      [true]
    );

    const phones = result.rows.map((row) => ({
      id: row.id,
      brand: row.brand,
      phoneName: row.phone_name,
      model: row.model,
      price: row.price,
      firstHandPrice: row.first_hand_price,
      description: row.description,
      ram: row.ram,
      rom: row.rom,
      city: row.city,
      state: row.state,
      zipcode: row.zipcode,
      country: row.country,
      phone: row.phone,
      images: row.image, // now array
    }));

    res.json({ phones });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the phones.',
    });
  }
});

// Get all phones (admin only)
phoneRoutes.get('/all-phones', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
              u.name as seller_name,
              u.email as seller_email
       FROM phones_for_sale p
       JOIN users u ON p.sold_by_user_id = u.id
       ORDER BY p.created_at DESC`
    );

    const phones = result.rows.map((row) => ({
      id: row.id,
      brand: row.brand,
      phoneName: row.phone_name,
      model: row.model,
      price: row.price,
      firstHandPrice: row.first_hand_price,
      description: row.description,
      ram: row.ram,
      rom: row.rom,
      city: row.city,
      state: row.state,
      zipcode: row.zipcode,
      country: row.country,
      phone: row.phone,
      images: row.image,
      isAvailable: row.is_available,
      sellerInfo: {
        name: row.seller_name,
        email: row.seller_email
      },
      createdAt: row.created_at
    }));

    res.json({ success: true, phones });
  } catch (error) {
    console.error('Admin phones error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch phones',
      error: error.message
    });
  }
});

// Get phone by ID
phoneRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM phones_for_sale WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Phone not found.' });
    }

    const phone = result.rows[0];

    res.json({
      id: phone.id,
      brand: phone.brand,
      phoneName: phone.phone_name,
      model: phone.model,
      price: phone.price,
      firstHandPrice: phone.first_hand_price,
      description: phone.description,
      ram: phone.ram,
      rom: phone.rom,
      city: phone.city,
      state: phone.state,
      zipcode: phone.zipcode,
      country: phone.country,
      phone: phone.phone,
      images: phone.image, // array
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the phone.',
    });
  }
});

// Toggle phone availability (admin only)
phoneRoutes.post('/toggleavailability', adminAuth, async (req, res) => {
  try {
    const { phoneId } = req.body;
    const result = await pool.query(
      `UPDATE phones_for_sale 
       SET is_available = NOT is_available 
       WHERE id = $1 
       RETURNING *`,
      [phoneId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Phone not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Availability updated',
      phone: result.rows[0] 
    });
  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
});



export default phoneRoutes;
