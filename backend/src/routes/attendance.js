const express = require('express');
const router = express.Router();
const {
  getAttendanceByLecture,
  getAttendanceByLectureAndDate
} = require('../controllers/attendanceController');

// GET /api/attendance/lecture/:lectureId - Get attendance by lecture ID
router.get('/lecture/:lectureId', getAttendanceByLecture);

// GET /api/attendance/lecture/:lectureId/date/:date - Get attendance by lecture ID and date
router.get('/lecture/:lectureId/date/:date', getAttendanceByLectureAndDate);

module.exports = router;