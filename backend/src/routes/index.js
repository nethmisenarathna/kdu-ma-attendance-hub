const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const statsRoutes = require('./stats');
const notificationRoutes = require('./notifications');
const teacherRoutes = require('./teachers');
const studentRoutes = require('./students');
const lectureRoutes = require('./lectures');
const classSessionRoutes = require('./classSessions');
const attendanceRoutes = require('./attendance');
const attendanceSummaryRoutes = require('./attendanceSummary');
const dashboardRoutes = require('./dashboard');

// Use route modules
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stats', statsRoutes);
router.use('/notifications', notificationRoutes);
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