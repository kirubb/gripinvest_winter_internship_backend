import db from '../config/db.js';

async function create(userId, productId, amount) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [userRows] = await connection.query('SELECT balance FROM users WHERE id = ? FOR UPDATE', [userId]);
    if (userRows.length === 0) throw new Error('User not found.');
    const user = userRows[0];

    if (user.balance < amount) {
      throw new Error('Insufficient balance to make this investment.');
    }

    const [productRows] = await connection.query('SELECT * FROM investment_products WHERE id = ?', [productId]);
    if (productRows.length === 0) throw new Error('Product not found.');
    const product = productRows[0];

    if (amount < product.min_investment) throw new Error(`Investment amount is less than the minimum of ${product.min_investment}.`);
    if (product.max_investment && amount > product.max_investment) throw new Error(`Investment amount exceeds the maximum of ${product.max_investment}.`);

    const annualYield = parseFloat(product.annual_yield);
    const tenureMonths = parseInt(product.tenure_months);
    const expected_return = parseFloat(amount) * (annualYield / 100) * (tenureMonths / 12);
    
    const investedAt = new Date();
    const maturity_date = new Date(new Date(investedAt).setMonth(investedAt.getMonth() + tenureMonths));

    await connection.query(
      `INSERT INTO investments (user_id, product_id, amount, expected_return, maturity_date) VALUES (?, ?, ?, ?, ?)`,
      [userId, productId, amount, expected_return, maturity_date]
    );

    const newBalance = user.balance - amount;
    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);

    await connection.commit();
    return { message: "Investment created successfully" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findByUserId(userId) {
  const [rows] = await db.query(
    `SELECT
       i.id, i.amount, i.invested_at, i.status, i.expected_return, i.maturity_date,
       p.name AS product_name, p.investment_type, p.annual_yield, p.risk_level
     FROM investments i
     JOIN investment_products p ON i.product_id = p.id
     WHERE i.user_id = ?`,
    [userId]
  );
  return rows;
}

async function cancel(userId, investmentId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [investmentRows] = await connection.query(
      'SELECT * FROM investments WHERE id = ? AND user_id = ? FOR UPDATE',
      [investmentId, userId]
    );

    if (investmentRows.length === 0) throw new Error('Investment not found or does not belong to user.');
    const investment = investmentRows[0];
    if (investment.status !== 'active') throw new Error('Only active investments can be cancelled.');

    await connection.query('UPDATE investments SET status = ? WHERE id = ?', ['cancelled', investmentId]);
    await connection.query('UPDATE users SET balance = balance + ? WHERE id = ?', [investment.amount, userId]);

    await connection.commit();
    return { message: 'Investment cancelled and amount refunded successfully.' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


export default {
  create,
  findByUserId,
  cancel,
};