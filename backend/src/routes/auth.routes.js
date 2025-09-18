const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Define the signup route
// POST /api/auth/signup
router.post('/signup', authController.signupController);

// Define the login route
// POST /api/auth/login
router.post('/login', authController.loginController);

module.exports = router;