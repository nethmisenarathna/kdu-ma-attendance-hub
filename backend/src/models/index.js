// Export all models for your real database
module.exports = {
  Admin: require('./Admin'),
  Teacher: require('./Teacher'),
  Student: require('./Student'),
  Lecture: require('./Lecture'),
  ClassSession: require('./ClassSession'),
  AttendanceSummary: require('./AttendanceSummary'),
  Notification: require('./Notification'),
  Report: require('./Report')
};