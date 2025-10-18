const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentByIndexNumber,
  getStudentsByDepartment,
  getStudentsByIntake
} = require('../controllers/studentController');

// GET /api/students - Get all students (your real 96 students)
router.get('/', getAllStudents);

// GET /api/students/index/:indexNumber - Get student by index number
router.get('/index/:indexNumber', getStudentByIndexNumber);

// GET /api/students/department/:department - Get students by department
router.get('/department/:department', getStudentsByDepartment);

// GET /api/students/intake/:intake - Get students by intake
router.get('/intake/:intake', getStudentsByIntake);

module.exports = router;