const mongoose = require('mongoose');

// Real Teacher Schema - matches your actual data structure
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  password: {
    type: String
  }
}, {
  timestamps: false // Your real data doesn't have timestamps
});

module.exports = mongoose.model('Teacher', teacherSchema);