const db = require('../config/db')

function generateDescription(product) {
    return `A ${product.risk_level}-risk ${product.investment_type} named "${product.name}" with an attractive annual yield of ${product.annual_yield}% over a ${product.tenure_months}-month tenure.`
}

async function create(productData) {
  let {
    name,
    investment_type,
    tenure_months,
    annual_yield,
    risk_level,
    min_investment,
    max_investment,
    description,
  } = productData

  if (!description || description.trim() === '') {
    description = generateDescription(productData);
  }

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
  )
  return { id: result.insertId, ...productData, description }
}

async function findAll() {
  const [rows] = await db.query('SELECT * FROM investment_products')
  return rows
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM investment_products WHERE id = ?', [id])
  return rows[0]
}

async function update(id, productData) {
  const { name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description } = productData
  const [result] = await db.query(
    `UPDATE investment_products SET name = ?, investment_type = ?, tenure_months = ?, annual_yield = ?, risk_level = ?, min_investment = ?, max_investment = ?, description = ? WHERE id = ?`,
    [ name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description, id ]
  )
  return result.affectedRows
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM investment_products WHERE id = ?', [id])
  return result.affectedRows
}

async function getRecommendations(riskAppetite) {
  const [rows] = await db.query(
    'SELECT * FROM investment_products WHERE risk_level = ? ORDER BY annual_yield DESC LIMIT 5',
    [riskAppetite]
  );
  return rows;
}


module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  getRecommendations,
}