import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import investmentRoutes from './routes/investment.routes.js';
import userRoutes from './routes/user.routes.js';
import logRoutes from './routes/log.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/logs', logRoutes);

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

export default app; // Export the app for testing and for our server