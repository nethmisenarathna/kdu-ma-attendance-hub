const Lecture = require('../models/Lecture');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Get all lectures (your real 26 lectures)
const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures',
      error: error.message
    });
  }
};

// Get lecture by code
const getLectureByCode = async (req, res) => {
  try {
    const lecture = await Lecture.findOne({ lecture_code: req.params.code });
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    res.json({
      success: true,
      data: lecture
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lecture',
      error: error.message
    });
  }
};

// Get lectures by department
const getLecturesByDepartment = async (req, res) => {
  try {
    const lectures = await Lecture.find({ department: req.params.department });
    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures by department',
      error: error.message
    });
  }
};

// Get lectures by intake
const getLecturesByIntake = async (req, res) => {
  try {
    const lectures = await Lecture.find({ intake: req.params.intake });
    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lectures by intake',
      error: error.message
    });
  }
};

// Get today's lecture statistics
const getTodaysLectureStats = async (req, res) => {
  try {
    // Get current date and time
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

    // Helper function to convert time string (HH:MM) to minutes
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return null;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Get all lectures for today
    const allLectures = await Lecture.find({ day_of_week: currentDay });
    
    // Enrich lectures with lecturer names and student counts
    const enrichedLectures = await Promise.all(
      allLectures.map(async (lecture) => {
        const lectureObj = lecture.toObject();
        
        // Get lecturer name(s) from email(s)
        if (lectureObj.lecturer_email) {
          // Check if it's an array or a single string
          const lecturerEmails = Array.isArray(lectureObj.lecturer_email) 
            ? lectureObj.lecturer_email 
            : [lectureObj.lecturer_email];
          
          const lecturerNames = await Promise.all(
            lecturerEmails.map(async (email) => {
              const teacher = await Teacher.findOne({ email });
              return teacher ? teacher.name : null;
            })
          );
          
          // Filter out null values
          const validNames = lecturerNames.filter(name => name !== null);
          
          if (validNames.length > 0) {
            lectureObj.lecturer_name = validNames[0]; // First lecturer for display
            lectureObj.all_lecturers = validNames; // All lecturers for modal
            lectureObj.lecturer_count = validNames.length;
          } else {
            lectureObj.lecturer_name = 'Lecturer TBA';
            lectureObj.all_lecturers = [];
            lectureObj.lecturer_count = 0;
          }
        } else {
          lectureObj.lecturer_name = 'Lecturer TBA';
          lectureObj.all_lecturers = [];
          lectureObj.lecturer_count = 0;
        }
        
        // Count students for this lecture (matching intake and streams)
        let studentCount = 0;
        if (lectureObj.intake && lectureObj.streams && lectureObj.streams.length > 0) {
          studentCount = await Student.countDocuments({
            intake: lectureObj.intake,
            stream: { $in: lectureObj.streams }
          });
        } else if (lectureObj.intake) {
          // If no streams specified, count all students in the intake
          studentCount = await Student.countDocuments({
            intake: lectureObj.intake
          });
        }
        
        lectureObj.student_count = studentCount;
        
        return lectureObj;
      })
    );
    
    // Count today's lectures
    const todaysLectureCount = enrichedLectures.length;

    // Count ongoing lectures
    const ongoingLectures = enrichedLectures.filter(lecture => {
      const startTime = timeToMinutes(lecture.start_time);
      const endTime = timeToMinutes(lecture.end_time);
      
      if (startTime === null || endTime === null) return false;
      
      return currentTime >= startTime && currentTime <= endTime;
    });

    const ongoingLectureCount = ongoingLectures.length;

    res.json({
      success: true,
      data: {
        todaysLectures: todaysLectureCount,
        ongoingLectures: ongoingLectureCount,
        currentDay: currentDay,
        currentTime: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        todaysLectureList: enrichedLectures,
        ongoingLectureList: ongoingLectures
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s lecture statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllLectures,
  getLectureByCode,
  getLecturesByDepartment,
  getLecturesByIntake,
  getTodaysLectureStats
};