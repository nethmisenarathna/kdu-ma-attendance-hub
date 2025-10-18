const { v4: uuidv4 } = require('uuid');

// Generate mock teachers
const generateMockTeachers = () => {
  return [
    {
      teacherId: 'TCH001',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@kdu.ac.lk',
      department: 'Computer Science',
      phone: '+94771234567',
      specialization: 'Software Engineering',
      isActive: true
    },
    {
      teacherId: 'TCH002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@kdu.ac.lk',
      department: 'Information Technology',
      phone: '+94771234568',
      specialization: 'Database Management',
      isActive: true
    },
    {
      teacherId: 'TCH003',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@kdu.ac.lk',
      department: 'Computer Science',
      phone: '+94771234569',
      specialization: 'Machine Learning',
      isActive: true
    }
  ];
};

// Generate mock students
const generateMockStudents = () => {
  return [
    {
      studentId: 'KDU2021001',
      firstName: 'Alice',
      lastName: 'Wilson',
      email: 'alice.wilson@student.kdu.ac.lk',
      course: 'BSc (Hons) in Computer Science',
      year: 3,
      semester: 1,
      phone: '+94771111111',
      address: 'Colombo, Sri Lanka',
      isActive: true
    },
    {
      studentId: 'KDU2021002',
      firstName: 'Bob',
      lastName: 'Davis',
      email: 'bob.davis@student.kdu.ac.lk',
      course: 'BSc (Hons) in Computer Science',
      year: 3,
      semester: 1,
      phone: '+94771111112',
      address: 'Kandy, Sri Lanka',
      isActive: true
    },
    {
      studentId: 'KDU2021003',
      firstName: 'Charlie',
      lastName: 'Miller',
      email: 'charlie.miller@student.kdu.ac.lk',
      course: 'BSc (Hons) in Information Technology',
      year: 2,
      semester: 2,
      phone: '+94771111113',
      address: 'Galle, Sri Lanka',
      isActive: true
    },
    {
      studentId: 'KDU2021004',
      firstName: 'Diana',
      lastName: 'Garcia',
      email: 'diana.garcia@student.kdu.ac.lk',
      course: 'BSc (Hons) in Computer Science',
      year: 3,
      semester: 1,
      phone: '+94771111114',
      address: 'Negombo, Sri Lanka',
      isActive: true
    }
  ];
};

// Generate mock lectures
const generateMockLectures = () => {
  return [
    {
      lectureId: 'CS301',
      title: 'Advanced Software Engineering',
      courseCode: 'CS301',
      courseName: 'Advanced Software Engineering',
      teacherId: 'TCH001',
      credits: 3,
      semester: 1,
      year: 3,
      description: 'Advanced concepts in software engineering including design patterns and architecture',
      isActive: true
    },
    {
      lectureId: 'CS302',
      title: 'Database Systems',
      courseCode: 'CS302',
      courseName: 'Database Systems',
      teacherId: 'TCH002',
      credits: 3,
      semester: 1,
      year: 3,
      description: 'Comprehensive study of database design and management systems',
      isActive: true
    },
    {
      lectureId: 'CS303',
      title: 'Machine Learning Fundamentals',
      courseCode: 'CS303',
      courseName: 'Machine Learning Fundamentals',
      teacherId: 'TCH003',
      credits: 4,
      semester: 1,
      year: 3,
      description: 'Introduction to machine learning algorithms and applications',
      isActive: true
    }
  ];
};

// Generate mock class sessions
const generateMockClassSessions = () => {
  const today = new Date();
  const sessions = [];
  
  // Generate sessions for the past week
  for (let i = 0; i < 7; i++) {
    const sessionDate = new Date(today);
    sessionDate.setDate(today.getDate() - i);
    
    sessions.push({
      sessionId: `SES${String(i + 1).padStart(3, '0')}`,
      lectureId: 'CS301',
      teacherId: 'TCH001',
      sessionDate: sessionDate,
      startTime: '10:00',
      endTime: '12:00',
      room: 'Room A101',
      sessionType: 'lecture',
      topic: `Software Engineering Topic ${i + 1}`,
      status: i === 0 ? 'scheduled' : 'completed',
      attendanceMarked: i !== 0
    });
    
    if (i < 3) {
      sessions.push({
        sessionId: `SES${String(i + 8).padStart(3, '0')}`,
        lectureId: 'CS302',
        teacherId: 'TCH002',
        sessionDate: sessionDate,
        startTime: '14:00',
        endTime: '16:00',
        room: 'Room B201',
        sessionType: 'lecture',
        topic: `Database Systems Topic ${i + 1}`,
        status: i === 0 ? 'scheduled' : 'completed',
        attendanceMarked: i !== 0
      });
    }
  }
  
  return sessions;
};

// Generate mock attendance records
const generateMockAttendance = () => {
  const attendance = [];
  const students = ['KDU2021001', 'KDU2021002', 'KDU2021003', 'KDU2021004'];
  const sessions = ['SES002', 'SES003', 'SES004', 'SES009', 'SES010'];
  const statuses = ['present', 'absent', 'late'];
  
  let attendanceCounter = 1;
  
  sessions.forEach(sessionId => {
    students.forEach(studentId => {
      const status = Math.random() > 0.2 ? 'present' : (Math.random() > 0.5 ? 'late' : 'absent');
      attendance.push({
        attendanceId: `ATT${String(attendanceCounter).padStart(3, '0')}`,
        sessionId,
        studentId,
        lectureId: sessionId.startsWith('SES00') && parseInt(sessionId.slice(-1)) <= 7 ? 'CS301' : 'CS302',
        status,
        markedAt: new Date(),
        markedBy: sessionId.startsWith('SES00') && parseInt(sessionId.slice(-1)) <= 7 ? 'TCH001' : 'TCH002',
        notes: status === 'late' ? 'Arrived 15 minutes late' : ''
      });
      attendanceCounter++;
    });
  });
  
  return attendance;
};

// Generate mock attendance summaries
const generateMockAttendanceSummaries = () => {
  const summaries = [];
  const students = ['KDU2021001', 'KDU2021002', 'KDU2021003', 'KDU2021004'];
  const lectures = ['CS301', 'CS302', 'CS303'];
  
  let summaryCounter = 1;
  
  students.forEach(studentId => {
    lectures.forEach(lectureId => {
      const totalSessions = Math.floor(Math.random() * 10) + 5; // 5-14 sessions
      const attendedSessions = Math.floor(totalSessions * (0.7 + Math.random() * 0.3)); // 70-100% attendance
      const absentSessions = totalSessions - attendedSessions;
      const lateSessions = Math.floor(Math.random() * 3); // 0-2 late sessions
      const attendancePercentage = Math.round((attendedSessions / totalSessions) * 100);
      
      summaries.push({
        summaryId: `SUM${String(summaryCounter).padStart(3, '0')}`,
        studentId,
        lectureId,
        semester: 1,
        year: 2024,
        totalSessions,
        attendedSessions,
        absentSessions,
        lateSessions,
        excusedSessions: 0,
        attendancePercentage,
        lastUpdated: new Date()
      });
      summaryCounter++;
    });
  });
  
  return summaries;
};

module.exports = {
  generateMockTeachers,
  generateMockStudents,
  generateMockLectures,
  generateMockClassSessions,
  generateMockAttendance,
  generateMockAttendanceSummaries
};