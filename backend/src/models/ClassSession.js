const mongoose = require('mongoose');

// Real ClassSession model based on your database (9 class sessions)
const realClassSessionSchema = new mongoose.Schema({
  lecture_code: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true,
  collection: 'class_sessions'
});

module.exports = mongoose.model('RealClassSession', realClassSessionSchema);