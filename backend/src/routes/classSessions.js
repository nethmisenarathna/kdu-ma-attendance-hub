const express = require('express');
const router = express.Router();
const {
  getAllClassSessions,
  getClassSessionsByLecture,
  getClassSessionsByStatus,
  getClassSessionById
} = require('../controllers/classSessionController');

// GET /api/class-sessions - Get all class sessions (your real 9 class sessions)
router.get('/', getAllClassSessions);

// GET /api/class-sessions/lecture/:lectureCode - Get class sessions by lecture code
router.get('/lecture/:lectureCode', getClassSessionsByLecture);

// GET /api/class-sessions/status/:status - Get class sessions by status
router.get('/status/:status', getClassSessionsByStatus);

// GET /api/class-sessions/:id - Get class session by ID
router.get('/:id', getClassSessionById);

module.exports = router;