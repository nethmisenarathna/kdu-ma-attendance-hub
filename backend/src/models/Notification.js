const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  sender_email: {
    type: String,
    required: true
  },
  sender_name: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['announcement', 'alert', 'info', 'reminder'],
    default: 'info'
  },
  is_read: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date
  },
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create TTL index on expires_at field
notificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.is_read = true;
  this.read_at = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
