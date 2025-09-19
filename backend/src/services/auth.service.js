import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Import the crypto module


function checkPasswordStrength(password) {
  const suggestions = [];
  if (password.length < 8) {
    suggestions.push('Use at least 8 characters.');
  }
  if (!/\d/.test(password)) {
    suggestions.push('Include at least one number.');
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push('Include at least one lowercase letter.');
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Include at least one uppercase letter.');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    suggestions.push('Include at least one special character (e.g., !@#$).');
  }

  const isStrong = suggestions.length === 0;
  const suggestionText = isStrong
    ? 'Strong password.'
    : `Weak password. Suggestions: ${suggestions.join(' ')}`;

  return { isStrong, suggestionText };
}

async function signup(userData) {
  const { first_name, last_name, email, password } = userData;

  const strength = checkPasswordStrength(password);
  if (!strength.isStrong) {
    const error = new Error(strength.suggestionText);
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  try {
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, password_hash]
    );
    return result;
  } catch (error) {
    console.error('Error in signup service:', error);
    throw error;
  }
}

async function login(loginData) {
  const { email, password } = loginData;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return null;
  }
  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return null;
  }
  const payload = {
    id: user.id,
    email: user.email,
    name: user.first_name,
    risk_appetite: user.risk_appetite,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

async function forgotPassword(email) {
  const [userRows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (userRows.length === 0) {
    throw new Error('User with that email does not exist.');
  }
  const user = userRows[0];

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const resetTokenExpires = new Date(Date.now() + 3600000); // Expires in 1 hour

  await db.query(
    'UPDATE users SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?',
    [resetTokenHash, resetTokenExpires, user.id]
  );

  return resetToken;
}


async function resetPassword({ token, password }) {
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const [userRows] = await db.query(
    'SELECT * FROM users WHERE reset_token_hash = ? AND reset_token_expires > ?',
    [resetTokenHash, new Date()]
  );

  if (userRows.length === 0) {
    throw new Error('Token is invalid or has expired.');
  }
  const user = userRows[0];

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  await db.query(
    'UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = ?',
    [password_hash, user.id]
  );

  return true;
}


export default {
  signup,
  login,
  forgotPassword,
  resetPassword,
};