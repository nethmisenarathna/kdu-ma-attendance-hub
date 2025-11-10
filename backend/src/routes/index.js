const express = require('express');
const router = express.Router();

// Import all route modules
const teacherRoutes = require('./teachers');
const studentRoutes = require('./students');
const lectureRoutes = require('./lectures');
const classSessionRoutes = require('./classSessions');
const attendanceRoutes = require('./attendance');
const attendanceSummaryRoutes = require('./attendanceSummary');
const dashboardRoutes = require('./dashboard');

// Use route modules
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/lectures', lectureRoutes);
router.use('/class-sessions', classSessionRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/attendance-summary', attendanceSummaryRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;