import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const cartRoutes = express.Router();

// Get cart items
cartRoutes.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.* FROM cart_items c
             JOIN phones_for_sale p ON c.phone_id = p.id
             WHERE c.user_id = $1`,
            [req.user.id]
        );

        res.json({ success: true, cartItems: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch cart items' 
        });
    }
});

// Add to cart (now prevents duplicates)
cartRoutes.post('/add', auth, async (req, res) => {
    try {
        const { phoneId } = req.body;

        // Check if phone exists
        const phoneCheck = await pool.query(
            'SELECT id FROM phones_for_sale WHERE id = $1',
            [phoneId]
        );
        
        if (phoneCheck.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Phone not found' 
            });
        }

        // Try to add (will fail if already exists due to unique constraint)
        await pool.query(
            `INSERT INTO cart_items (user_id, phone_id)
             VALUES ($1, $2)`,
            [req.user.id, phoneId]
        );

        res.json({ success: true });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ 
                success: false, 
                message: 'Phone already in cart' 
            });
        }
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add to cart' 
        });
    }
});

// Remove from cart (unchanged)
cartRoutes.post('/remove', auth, async (req, res) => {
    try {
        const { phoneId } = req.body;
        await pool.query(
            `DELETE FROM cart_items 
             WHERE user_id = $1 AND phone_id = $2`,
            [req.user.id, phoneId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove from cart' 
        });
    }
});

// Get cart total (simplified)
cartRoutes.get('/total', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT SUM(p.price) as total
             FROM cart_items c
             JOIN phones_for_sale p ON c.phone_id = p.id
             WHERE c.user_id = $1`,
            [req.user.id]
        );
        res.json({ success: true, total: result.rows[0].total || 0 });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to calculate total' 
        });
    }
});

// Clear cart (unchanged)
cartRoutes.delete('/clear', auth, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM cart_items WHERE user_id = $1',
            [req.user.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to clear cart' 
        });
    }
});

export default cartRoutes;