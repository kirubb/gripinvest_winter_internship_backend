const authService = require('../services/auth.service');

/**
 * Controller for handling user signup
 */
async function signupController(req, res) {
  // Get user data from the request body
  const userData = req.body;

  // Basic validation
  if (!userData.email || !userData.password || !userData.first_name) {
    return res.status(400).json({ message: 'First name, email, and password are required.' });
  }

  try {
    const result = await authService.signup(userData);

    // If the user was created successfully (affectedRows will be 1)
    if (result.affectedRows) {
      res.status(201).json({ message: 'User created successfully!' });
    } else {
      // This case is unlikely but good to handle
      throw new Error('User creation failed.');
    }
  } catch (error) {
    // A common error is a duplicate email (error code ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Error: Email already exists.' });
    }
    // For all other errors
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
}


async function loginController(req, res) {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const token = await authService.login({ email, password });

    if (!token) {
      // This means user not found or password was incorrect
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Send the token back to the client on successful login
    res.status(200).json({
      message: 'Login successful!',
      token: token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
}

module.exports = {
  signupController,
  loginController,
};