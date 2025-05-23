import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './config/db.js'; 
import userRoutes from './routes/userRoutes.js';
import phoneRoutes from './routes/phonesRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import connectDb from './config/pg.js';

const app = express();
const port = process.env.PORT || 4000;



// Connect to PostgreSQL
connectDb();  // Establish PostgreSQL connection

// Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/phones', phoneRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
app.listen(port, () => console.log('Server started on PORT : ' + port));