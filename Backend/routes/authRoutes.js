// Backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/register', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
