const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['attendance_summary', 'monthly_summary'],
    required: true
  },
  stream: {
    type: String,
    enum: ['CS', 'SE', 'CE'],
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  generatedBy: {
    type: String,
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
