import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', authController.signupController);
router.post('/login', authController.loginController);
router.post('/forgot-password', authController.forgotPasswordController);
router.post('/reset-password', authController.resetPasswordController);

export default router;