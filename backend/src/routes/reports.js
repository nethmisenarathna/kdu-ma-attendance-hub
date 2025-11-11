const express = require('express');
const router = express.Router();
const {
  generateReport,
  downloadReport,
  getReportStats
} = require('../controllers/reportsController');

// GET /api/reports/stats - Get report statistics
router.get('/stats', getReportStats);

// POST /api/reports/generate - Generate report (increment counter only)
router.post('/generate', generateReport);

// POST /api/reports/download - Download report (generate Excel + increment counter)
router.post('/download', downloadReport);

module.exports = router;
