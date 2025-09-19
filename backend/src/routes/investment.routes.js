import express from 'express';
const router = express.Router();
import investmentController from '../controllers/investment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

// All routes in this file are protected and require a valid JWT

// Route to create a new investment
// POST /api/investments
router.post('/', authenticateToken, investmentController.create);

// Route to get the logged-in user's portfolio
// GET /api/investments
router.get('/', authenticateToken, investmentController.getPortfolio);

export default router