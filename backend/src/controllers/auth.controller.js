import authService from '../services/auth.service.js';

async function signupController(req, res) {
  const userData = req.body;

  if (!userData.email || !userData.password || !userData.first_name) {
    return res.status(400).json({ message: 'First name, email, and password are required.' });
  }

  try {
    const result = await authService.signup(userData);
    if (result.affectedRows) {
      res.status(201).json({ message: 'User created successfully!' });
    } else {
      throw new Error('User creation failed.');
    }
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Error: Email already exists.' });
    }
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const token = await authService.login({ email, password });

    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({
      message: 'Login successful!',
      token: token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
}

async function forgotPasswordController(req, res) {
  try {
    const resetToken = await authService.forgotPassword(req.body.email);
    console.log('--- PASSWORD RESET TOKEN (Copy this) ---');
    console.log(resetToken);
    console.log('-----------------------------------------');
    res.json({ message: 'If a user with that email exists, a reset token has been generated. Check the server console.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function resetPasswordController(req, res) {
  try {
    await authService.resetPassword(req.body);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default {
  signupController,
  loginController,
  resetPasswordController,
  forgotPasswordController,
};