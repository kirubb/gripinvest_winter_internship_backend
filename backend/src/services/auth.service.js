const db = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function checkPasswordStrength(password) {
  const suggestions = []
  if (password.length < 8) {
    suggestions.push('Use at least 8 characters.')
  }
  if (!/\d/.test(password)) {
    suggestions.push('Include at least one number.')
  }
  if (!/[a-z]/.test(password)) {
    suggestions.push('Include at least one lowercase letter.')
  }
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Include at least one uppercase letter.')
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    suggestions.push('Include at least one special character (e.g., !@#$).')
  }
  
  const isStrong = suggestions.length === 0
  const suggestionText = isStrong ? 'Strong password.' : `Weak password. Suggestions: ${suggestions.join(' ')}`

  return { isStrong, suggestionText }
}

async function signup(userData) {
  const { first_name, last_name, email, password } = userData
  
  const strength = checkPasswordStrength(password)
  if (!strength.isStrong) {
    const error = new Error(strength.suggestionText)
    error.statusCode = 400
    throw error
  }

  const salt = await bcrypt.genSalt(10)
  const password_hash = await bcrypt.hash(password, salt)

  try {
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, password_hash]
    )
    return result
  } catch (error) {
    console.error("Error in signup service:", error)
    throw error
  }
}

async function login(loginData) {
  const { email, password } = loginData
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
  if (rows.length === 0) {
    return null
  }
  const user = rows[0]
  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    return null
  }
  const payload = { id: user.id, email: user.email, name: user.first_name }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
  return token
}

module.exports = {
  signup,
  login,
}