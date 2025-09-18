const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes in this file are protected and require a valid JWT

// Route to create a new investment
// POST /api/investments
router.post('/', authenticateToken, investmentController.create);

// Route to get the logged-in user's portfolio
// GET /api/investments
router.get('/', authenticateToken, investmentController.getPortfolio);

module.exports = router;