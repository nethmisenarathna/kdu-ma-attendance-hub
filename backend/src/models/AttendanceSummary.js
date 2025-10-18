const mongoose = require('mongoose');

// Real AttendanceSummary model based on your database (6 attendance summaries)
const realAttendanceSummarySchema = new mongoose.Schema({
  index_number: {
    type: String,
    required: true
  },
  lecture_code: {
    type: String,
    required: true
  },
  total_lectures: {
    type: Number,
    default: 0
  },
  attended_lectures: {
    type: Number,
    default: 0
  },
  attendance_percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['good', 'warning', 'critical'],
    default: 'good'
  }
}, {
  timestamps: true,
  collection: 'attendance_summary'
});

module.exports = mongoose.model('RealAttendanceSummary', realAttendanceSummarySchema);