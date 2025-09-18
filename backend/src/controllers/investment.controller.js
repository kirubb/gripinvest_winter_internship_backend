const investmentService = require('../services/investment.service');

// Controller to handle CREATING a new investment
async function create(req, res) {
  try {
    const userId = req.user.id; // Get user ID from the authenticated token
    const { productId, amount } = req.body;

    if (!productId || !amount) {
      return res.status(400).json({ message: 'productId and amount are required.' });
    }

    const result = await investmentService.create(userId, productId, amount);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ message: error.message });
  }
}

// Controller to handle FETCHING the user's portfolio
async function getPortfolio(req, res) {
  try {
    const userId = req.user.id; // Get user ID from the authenticated token
    const portfolio = await investmentService.findByUserId(userId);
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
}

module.exports = {
  create,
  getPortfolio,
};