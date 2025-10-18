const AttendanceSummary = require('../models/AttendanceSummary');

// Get all attendance summaries (your real 6 attendance summaries)
const getAllAttendanceSummaries = async (req, res) => {
  try {
    const summaries = await AttendanceSummary.find();
    res.json({
      success: true,
      count: summaries.length,
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance summaries',
      error: error.message
    });
  }
};

// Get attendance summary by student index number
const getAttendanceSummaryByStudent = async (req, res) => {
  try {
    const summaries = await AttendanceSummary.find({ index_number: req.params.indexNumber });
    res.json({
      success: true,
      count: summaries.length,
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance summary for student',
      error: error.message
    });
  }
};

// Get attendance summary by lecture code
const getAttendanceSummaryByLecture = async (req, res) => {
  try {
    const summaries = await AttendanceSummary.find({ lecture_code: req.params.lectureCode });
    res.json({
      success: true,
      count: summaries.length,
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance summary for lecture',
      error: error.message
    });
  }
};

// Get attendance summaries by status
const getAttendanceSummariesByStatus = async (req, res) => {
  try {
    const summaries = await AttendanceSummary.find({ status: req.params.status });
    res.json({
      success: true,
      count: summaries.length,
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance summaries by status',
      error: error.message
    });
  }
};

module.exports = {
  getAllAttendanceSummaries,
  getAttendanceSummaryByStudent,
  getAttendanceSummaryByLecture,
  getAttendanceSummariesByStatus
};