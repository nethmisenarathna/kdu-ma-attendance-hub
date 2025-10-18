const express = require('express');
const router = express.Router();
const {
  getAllLectures,
  getLectureByCode,
  getLecturesByDepartment,
  getLecturesByIntake
} = require('../controllers/lectureController');

// GET /api/lectures - Get all lectures (your real 26 lectures)
router.get('/', getAllLectures);

// GET /api/lectures/code/:code - Get lecture by code
router.get('/code/:code', getLectureByCode);

// GET /api/lectures/department/:department - Get lectures by department
router.get('/department/:department', getLecturesByDepartment);

// GET /api/lectures/intake/:intake - Get lectures by intake
router.get('/intake/:intake', getLecturesByIntake);

module.exports = router;