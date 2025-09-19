import productService from '../services/product.service.js';
// Controller to handle CREATING a new product
async function create(req, res) {
  try {
    const newProduct = await productService.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
}

// Controller to handle FETCHING all products
async function getAll(req, res) {
  try {
    const products = await productService.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
}

// Controller to handle FETCHING one product by its ID
async function getOne(req, res) {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
}

// Controller to handle UPDATING a product
async function update(req, res) {
  try {
    const affectedRows = await productService.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found or data is the same' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
}

// Controller to handle DELETING a product
async function remove(req, res) {
  try {
    const affectedRows = await productService.remove(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
}

async function getRecommendations(req, res) {
  try {
    const userRiskAppetite = req.user.risk_appetite; // We'll need to add this to the JWT
    const products = await productService.getRecommendations(userRiskAppetite);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
}

export default  {
  create,
  getAll,
  getOne,
  update,
  remove,
  getRecommendations
};