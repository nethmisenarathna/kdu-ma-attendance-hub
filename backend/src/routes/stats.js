const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Public routes (you can add auth middleware if needed)
router.get('/completion-rate', statsController.getCompletionRate);
router.get('/dashboard', statsController.getDashboardStats);
router.get('/weekly-trend', statsController.getWeeklyTrend);

module.exports = router;
