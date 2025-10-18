// Export all models for your real database
module.exports = {
  Teacher: require('./Teacher'),
  Student: require('./Student'),
  Lecture: require('./Lecture'),
  ClassSession: require('./ClassSession'),
  AttendanceSummary: require('./AttendanceSummary')
};