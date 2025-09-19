import express from 'express';
import logController from '../controllers/log.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/summary', authenticateToken, logController.getLogSummary);
router.get('/error-summary', authenticateToken, logController.getErrorSummary);
router.get('/', authenticateToken, logController.getMyLogs);
router.post('/search', authenticateToken, logController.searchLogsByEmail);

export default router;