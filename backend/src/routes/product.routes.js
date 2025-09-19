const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Route to get all products
// GET /api/products
router.get('/', productController.getAll);

// Route to create a new product
// POST /api/products
router.post('/', productController.create);

// Route to get a single product by its ID
// GET /api/products/:id
router.get('/:id', productController.getOne);

// Route to update a product by its ID
// PUT /api/products/:id
router.put('/:id', productController.update);

// Route to delete a product by its ID
// DELETE /api/products/:id
router.delete('/:id', productController.remove);

router.get('/recommendations', authenticateToken, productController.getRecommendations);


module.exports = router;