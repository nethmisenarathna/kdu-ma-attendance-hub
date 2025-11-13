const mongoose = require('mongoose');

// Real ClassSession model based on your actual database structure
const classSessionSchema = new mongoose.Schema({
  date: {
    type: String, // Stored as string in your DB: "2025-11-10"
    required: true
  },
  lecture_id: {
    type: String, // Links to lecture_code in lectures collection
    required: true
  },
  expires_at: {
    type: Date
  },
  lecturer_email: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'ongoing', 'finalized', 'cancelled'],
    default: 'active'
  },
  timer_duration_sec: {
    type: Number
  },
  timer_started_at: {
    type: Date
  }
}, {
  timestamps: false,
  collection: 'class_sessions'
});

module.exports = mongoose.model('ClassSession', classSessionSchema, 'class_sessions');