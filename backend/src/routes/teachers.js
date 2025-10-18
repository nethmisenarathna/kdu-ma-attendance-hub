const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getTeacherByEmail,
  getTeachersByDepartment
} = require('../controllers/teacherController');

// GET /api/teachers - Get all teachers (your real 42 teachers)
router.get('/', getAllTeachers);

// GET /api/teachers/email/:email - Get teacher by email
router.get('/email/:email', getTeacherByEmail);

// GET /api/teachers/department/:department - Get teachers by department
router.get('/department/:department', getTeachersByDepartment);

module.exports = router;