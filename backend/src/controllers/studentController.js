const Student = require('../models/Student');

// Get all students (your real 96 students)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get student by index number
const getStudentByIndex = async (req, res) => {
  try {
    const student = await Student.findOne({ index_number: req.params.index });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// Get students by department
const getStudentsByDepartment = async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.department });
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students by department',
      error: error.message
    });
  }
};

// Get students by intake
const getStudentsByIntake = async (req, res) => {
  try {
    const students = await Student.find({ intake: req.params.intake });
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students by intake',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentByIndexNumber: getStudentByIndex,
  getStudentsByDepartment,
  getStudentsByIntake
};