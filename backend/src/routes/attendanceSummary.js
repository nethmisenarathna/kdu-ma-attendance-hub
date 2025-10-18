const express = require('express');
const router = express.Router();
const {
  getAllAttendanceSummaries,
  getAttendanceSummaryByStudent,
  getAttendanceSummaryByLecture,
  getAttendanceSummariesByStatus
} = require('../controllers/attendanceSummaryController');

// GET /api/attendance-summary - Get all attendance summaries (your real 6 summaries)
router.get('/', getAllAttendanceSummaries);

// GET /api/attendance-summary/student/:indexNumber - Get attendance summary by student index
router.get('/student/:indexNumber', getAttendanceSummaryByStudent);

// GET /api/attendance-summary/lecture/:lectureCode - Get attendance summary by lecture code
router.get('/lecture/:lectureCode', getAttendanceSummaryByLecture);

// GET /api/attendance-summary/status/:status - Get attendance summaries by status
router.get('/status/:status', getAttendanceSummariesByStatus);

module.exports = router;