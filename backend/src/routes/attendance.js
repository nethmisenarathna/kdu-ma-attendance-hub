const express = require('express');
const router = express.Router();
const {
  getAllAttendance,
  getAttendanceBySession,
  getAttendanceByStudent,
  markAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');

// GET /api/attendance - Get all attendance records
router.get('/', getAllAttendance);

// GET /api/attendance/session/:sessionId - Get attendance by session ID
router.get('/session/:sessionId', getAttendanceBySession);

// GET /api/attendance/student/:studentId - Get attendance by student ID
router.get('/student/:studentId', getAttendanceByStudent);

// POST /api/attendance - Mark attendance for multiple students
router.post('/', markAttendance);

// PUT /api/attendance/:id - Update attendance record
router.put('/:id', updateAttendance);

// DELETE /api/attendance/:id - Delete attendance record
router.delete('/:id', deleteAttendance);

module.exports = router;