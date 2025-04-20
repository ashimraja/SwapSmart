import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import pool from '../config/db.js'; // PostgreSQL pool connection

const userRoutes = express.Router();

// Function to generate JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Register Route
userRoutes.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email' });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Password too short' });
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );

    const token = createToken(newUser.rows[0].id);
    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

// ✅ Login Route
userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user.id);
    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});

userRoutes.post('/admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const adminIdentifier = email + password;
      const token = jwt.sign(
        { 
          adminIdentifier,  // This matches what your middleware checks for
          role: 'admin'     // Good practice to include role
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' }  // Add expiration
      );
      
      return res.json({ 
        success: true, 
        token,
        message: 'Admin login successful'
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});
export default userRoutes;
