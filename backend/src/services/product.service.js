const db = require('../config/db');

// --- Service to CREATE a new product ---
async function create(productData) {
  const {
    name,
    investment_type,
    tenure_months,
    annual_yield,
    risk_level,
    min_investment,
    max_investment,
    description,
  } = productData;

  const [result] = await db.query(
    `INSERT INTO investment_products (name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      investment_type,
      tenure_months,
      annual_yield,
      risk_level,
      min_investment,
      max_investment,
      description,
    ]
  );
  return { id: result.insertId, ...productData };
}

// --- Service to READ all products ---
async function findAll() {
  const [rows] = await db.query('SELECT * FROM investment_products');
  return rows;
}

// --- Service to READ one product by ID ---
async function findById(id) {
  const [rows] = await db.query('SELECT * FROM investment_products WHERE id = ?', [id]);
  return rows[0]; // Return the first row, or undefined if not found
}

// --- Service to UPDATE a product by ID ---
async function update(id, productData) {
  const {
    name,
    investment_type,
    tenure_months,
    annual_yield,
    risk_level,
    min_investment,
    max_investment,
    description,
  } = productData;

  const [result] = await db.query(
    `UPDATE investment_products
     SET name = ?, investment_type = ?, tenure_months = ?, annual_yield = ?, risk_level = ?, min_investment = ?, max_investment = ?, description = ?
     WHERE id = ?`,
    [
      name,
      investment_type,
      tenure_months,
      annual_yield,
      risk_level,
      min_investment,
      max_investment,
      description,
      id,
    ]
  );
  return result.affectedRows; // Returns 1 if update was successful, 0 otherwise
}

// --- Service to DELETE a product by ID ---
async function remove(id) {
  const [result] = await db.query('DELETE FROM investment_products WHERE id = ?', [id]);
  return result.affectedRows; // Returns 1 if delete was successful, 0 otherwise
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};