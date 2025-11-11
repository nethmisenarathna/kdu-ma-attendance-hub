const express = require('express');
const router = express.Router();
const {
  getAttendanceByLecture,
  getAttendanceByLectureAndDate
} = require('../controllers/attendanceController');
const {
  exportAttendanceSummary
} = require('../controllers/attendanceExportController');

// GET /api/attendance/export - Export attendance summary as Excel
router.get('/export', exportAttendanceSummary);

// GET /api/attendance/lecture/:lectureId - Get attendance by lecture ID
router.get('/lecture/:lectureId', getAttendanceByLecture);

// GET /api/attendance/lecture/:lectureId/date/:date - Get attendance by lecture ID and date
router.get('/lecture/:lectureId/date/:date', getAttendanceByLectureAndDate);

module.exports = router;