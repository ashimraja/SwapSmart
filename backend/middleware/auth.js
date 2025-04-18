import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // Your PostgreSQL pool
// auth.js - Verify this is correct
const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
      
      if (user.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      req.user = user.rows[0];
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  };
export default auth