require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const { loggerMiddleware } = require('./middleware/logger.middleware');
app.use(loggerMiddleware);

// API Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const investmentRoutes = require('./routes/investment.routes');
app.use('/api/investments', investmentRoutes);

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Simple Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Grip Invest Mini Platform API!');
});

module.exports = app; // Export the app for testing and for our server