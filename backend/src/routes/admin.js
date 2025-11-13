const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// All routes are protected (require authentication)
router.get('/profile', auth, adminController.getProfile);
router.put('/profile', auth, adminController.updateProfile);
router.put('/password', auth, adminController.updatePassword);

module.exports = router;
