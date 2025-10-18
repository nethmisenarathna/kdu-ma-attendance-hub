const Lecture = require('../models/Lecture');

// Get all lectures (your real 26 lectures)
const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures',
      error: error.message
    });
  }
};

// Get lecture by code
const getLectureByCode = async (req, res) => {
  try {
    const lecture = await Lecture.findOne({ lecture_code: req.params.code });
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    res.json({
      success: true,
      data: lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecture',
      error: error.message
    });
  }
};

// Get lectures by department
const getLecturesByDepartment = async (req, res) => {
  try {
    const lectures = await Lecture.find({ department: req.params.department });
    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures by department',
      error: error.message
    });
  }
};

// Get lectures by intake
const getLecturesByIntake = async (req, res) => {
  try {
    const lectures = await Lecture.find({ intake: req.params.intake });
    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures by intake',
      error: error.message
    });
  }
};

module.exports = {
  getAllLectures,
  getLectureByCode,
  getLecturesByDepartment,
  getLecturesByIntake
};