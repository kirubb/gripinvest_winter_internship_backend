import express from 'express';
import investmentController from '../controllers/investment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, investmentController.create);
router.get('/', authenticateToken, investmentController.getPortfolio);
router.put('/:investmentId/cancel', authenticateToken, investmentController.cancel);

export default router;