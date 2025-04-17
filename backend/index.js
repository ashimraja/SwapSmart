import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/pg.js';  // Import PostgreSQL connection

// App Config
const app = express();
const port = process.env.PORT || 4000;


// Connect to PostgreSQL
connectDb();  // Establish PostgreSQL connection

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => console.log('Server started on PORT : ' + port));
