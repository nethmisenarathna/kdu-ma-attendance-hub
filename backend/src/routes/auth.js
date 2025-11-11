const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.post('/logout', auth, authController.logout);
router.get('/verify', auth, authController.verifyToken);

module.exports = router;
