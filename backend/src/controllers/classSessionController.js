const ClassSession = require('../models/ClassSession');

// Get all class sessions (your real 9 class sessions)
const getAllClassSessions = async (req, res) => {
  try {
    const classSessions = await ClassSession.find();
    res.json({
      success: true,
      count: classSessions.length,
      data: classSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class sessions',
      error: error.message
    });
  }
};

// Get class sessions by lecture code
const getClassSessionsByLecture = async (req, res) => {
  try {
    const classSessions = await ClassSession.find({ lecture_code: req.params.lectureCode });
    res.json({
      success: true,
      count: classSessions.length,
      data: classSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class sessions for lecture',
      error: error.message
    });
  }
};

// Get class sessions by status
const getClassSessionsByStatus = async (req, res) => {
  try {
    const classSessions = await ClassSession.find({ status: req.params.status });
    res.json({
      success: true,
      count: classSessions.length,
      data: classSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class sessions by status',
      error: error.message
    });
  }
};

// Get class session by ID
const getClassSessionById = async (req, res) => {
  try {
    const classSession = await ClassSession.findById(req.params.id);
    
    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: 'Class session not found'
      });
    }
    
    res.json({
      success: true,
      data: classSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class session',
      error: error.message
    });
  }
};

module.exports = {
  getAllClassSessions,
  getClassSessionsByLecture,
  getClassSessionsByStatus,
  getClassSessionById
};