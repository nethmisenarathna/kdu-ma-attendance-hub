const mongoose = require('mongoose');

// Real Lecture Schema - matches your actual data structure  
const lectureSchema = new mongoose.Schema({
  lecture_code: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  intake: {
    type: String,
    required: true
  },
  streams: [{
    type: String
  }],
  day_of_week: {
    type: String
  },
  start_time: {
    type: String
  },
  end_time: {
    type: String
  },
  location: {
    type: String
  },
  lecturer_email: {
    type: String
  },
  department: {
    type: String
  },
  recurring: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: false // Your real data doesn't have timestamps
});

module.exports = mongoose.model('Lecture', lectureSchema);