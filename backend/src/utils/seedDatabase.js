const dotenv = require('dotenv');
const connectDB = require('../config/database');
const {
  Teacher,
  Student,
  Lecture,
  ClassSession,
  Attendance,
  AttendanceSummary
} = require('../models');
const {
  generateMockTeachers,
  generateMockStudents,
  generateMockLectures,
  generateMockClassSessions,
  generateMockAttendance,
  generateMockAttendanceSummaries
} = require('./mockData');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Promise.all([
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Lecture.deleteMany({}),
      ClassSession.deleteMany({}),
      Attendance.deleteMany({}),
      AttendanceSummary.deleteMany({})
    ]);
    
    console.log('Cleared existing data');
    
    // Insert mock data
    const teachers = await Teacher.insertMany(generateMockTeachers());
    console.log(`✓ Inserted ${teachers.length} teachers`);
    
    const students = await Student.insertMany(generateMockStudents());
    console.log(`✓ Inserted ${students.length} students`);
    
    const lectures = await Lecture.insertMany(generateMockLectures());
    console.log(`✓ Inserted ${lectures.length} lectures`);
    
    const classSessions = await ClassSession.insertMany(generateMockClassSessions());
    console.log(`✓ Inserted ${classSessions.length} class sessions`);
    
    const attendance = await Attendance.insertMany(generateMockAttendance());
    console.log(`✓ Inserted ${attendance.length} attendance records`);
    
    const attendanceSummaries = await AttendanceSummary.insertMany(generateMockAttendanceSummaries());
    console.log(`✓ Inserted ${attendanceSummaries.length} attendance summaries`);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Check if script is run directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;