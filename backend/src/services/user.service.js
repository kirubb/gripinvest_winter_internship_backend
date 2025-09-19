import db from '../config/db.js';

async function findById(userId) {
  const [rows] = await db.query(
    'SELECT id, first_name, last_name, email, risk_appetite, balance FROM users WHERE id = ?',
    [userId]
  );
  return rows[0];
}

async function updateProfile(userId, { risk_appetite, addBalance }) {
  const currentUser = await findById(userId);
  if (!currentUser) throw new Error('User not found');

  const newRiskAppetite = risk_appetite || currentUser.risk_appetite;
  const currentBalance = parseFloat(currentUser.balance);
  const amountToAdd = parseFloat(addBalance) || 0;
  const newBalance = currentBalance + amountToAdd;

  await db.query(
    'UPDATE users SET risk_appetite = ?, balance = ? WHERE id = ?',
    [newRiskAppetite, newBalance, userId]
  );

  return findById(userId);
}

export default {
  findById,
  updateProfile,
};