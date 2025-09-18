const db = require('../config/db');

/**
 * Creates a new investment for a user.
 * @param {string} userId - The ID of the user making the investment.
 * @param {string} productId - The ID of the product being invested in.
 * @param {number} amount - The investment amount.
 * @returns {object} The newly created investment record.
 */
async function create(userId, productId, amount) {
  // 1. First, fetch the product details to get yield and tenure
  const [productRows] = await db.query('SELECT * FROM investment_products WHERE id = ?', [productId]);
  if (productRows.length === 0) {
    throw new Error('Product not found.');
  }
  const product = productRows[0];

  // 2. Business Rule Validation
  if (amount < product.min_investment) {
    throw new Error(`Investment amount is less than the minimum of ${product.min_investment}.`);
  }
  if (product.max_investment && amount > product.max_investment) {
    throw new Error(`Investment amount exceeds the maximum of ${product.max_investment}.`);
  }

  // 3. Calculate expected return and maturity date
  const annualYield = parseFloat(product.annual_yield);
  const tenureMonths = parseInt(product.tenure_months);
  // Simple Interest Calculation: P * R * T
  const expected_return = parseFloat(amount) * (annualYield / 100) * (tenureMonths / 12);
  
  // Calculate maturity date from now
  const investedAt = new Date();
  const maturity_date = new Date(investedAt.setMonth(investedAt.getMonth() + tenureMonths));

  // 4. Insert the new investment into the database
  const [result] = await db.query(
    `INSERT INTO investments (user_id, product_id, amount, expected_return, maturity_date)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, productId, amount, expected_return, maturity_date]
  );

  return { id: result.insertId, message: "Investment created successfully" };
}

/**
 * Finds all investments for a specific user (their portfolio).
 * @param {string} userId - The ID of the user.
 * @returns {Array} A list of the user's investments with product details.
 */
async function findByUserId(userId) {
  const [rows] = await db.query(
    `SELECT
       i.id,
       i.amount,
       i.invested_at,
       i.status,
       i.expected_return,
       i.maturity_date,
       p.name AS product_name,
       p.investment_type,
       p.annual_yield,
       p.risk_level
     FROM investments i
     JOIN investment_products p ON i.product_id = p.id
     WHERE i.user_id = ?`,
    [userId]
  );
  return rows;
}

module.exports = {
  create,
  findByUserId,
};