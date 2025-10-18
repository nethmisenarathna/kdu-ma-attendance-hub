const Teacher = require('../models/Teacher');

// Get all teachers (your real 42 teachers)
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// Get teacher by email
const getTeacherByEmail = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.params.email });
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }
    
    res.json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: error.message
    });
  }
};

// Get teachers by department
const getTeachersByDepartment = async (req, res) => {
  try {
    const teachers = await Teacher.find({ department: req.params.department });
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers by department',
      error: error.message
    });
  }
};

module.exports = {
  getAllTeachers,
  getTeacherByEmail,
  getTeachersByDepartment
};