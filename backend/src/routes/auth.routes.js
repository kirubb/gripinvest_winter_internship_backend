import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', authController.signupController);
router.post('/login', authController.loginController);

export default router;