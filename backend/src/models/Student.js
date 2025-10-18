const mongoose = require('mongoose');

// Real Student Schema - matches your actual data structure
const studentSchema = new mongoose.Schema({
  index_number: {
    type: String,
    required: true,
    unique: true
  },
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
  },
  intake: {
    type: String
  },
  stream: {
    type: String
  }
}, {
  timestamps: false // Your real data doesn't have timestamps
});

module.exports = mongoose.model('Student', studentSchema);