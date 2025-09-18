const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Creates a new user in the database
 * @param {object} userData - The user's data (firstName, lastName, email, password)
 * @returns {object} The result of the database insertion
 */
async function signup(userData) {
  const { first_name, last_name, email, password } = userData;

  // --- Security: Never store passwords in plain text ---
  // 1. Generate a "salt" to add randomness to the hash
  const salt = await bcrypt.genSalt(10);
  // 2. Hash the password with the salt
  const password_hash = await bcrypt.hash(password, salt);

  try {
    // --- Database Interaction ---
    // Use '?' placeholders to prevent SQL Injection attacks
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, password_hash]
    );

    return result;
  } catch (error) {
    // Log the error for debugging
    console.error("Error in signup service:", error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
}

const jwt = require('jsonwebtoken'); // <-- Make sure jsonwebtoken is imported at the top

/**
 * Logs a user in
 * @param {object} loginData - The user's login data (email, password)
 * @returns {string|null} A JWT if successful, otherwise null
 */
async function login(loginData) {
  const { email, password } = loginData;

  // 1. Find the user by their email
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return null; // User not found
  }
  const user = rows[0];

  // 2. Compare the provided password with the stored hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return null; // Passwords don't match
  }

  // 3. If password matches, create a JWT
  const payload = {
    id: user.id,
    email: user.email,
    name: user.first_name,
  };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  return token; // Success! Return the token.
}

module.exports = {
  signup,
  login,
};