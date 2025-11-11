const mongoose = require('mongoose');

// Get attendance records for a specific lecture
const getAttendanceByLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { date } = req.query; // Optional: filter by specific date
    
    const db = mongoose.connection.db;
    const attendanceCollection = db.collection('attendance');
    
    // Build query
    const query = { lecture_id: lectureId };
    if (date) {
      query.date = date;
    }
    
    // Fetch attendance records
    const attendanceRecords = await attendanceCollection
      .find(query)
      .sort({ date: -1, marked_at: -1 })
      .toArray();
    
    if (attendanceRecords.length === 0) {
      return res.json({
        success: true,
        message: 'No attendance records found for this lecture',
        data: {
          lecture_id: lectureId,
          records: [],
          summary: {
            total: 0,
            cs: { present: 0, total: 0 },
            se: { present: 0, total: 0 },
            ce: { present: 0, total: 0 }
          }
        }
      });
    }
    
    // Get lecture details (lectures use lecture_code field)
    const lecturesCollection = db.collection('lectures');
    const lecture = await lecturesCollection.findOne({ 
      $or: [
        { lecture_id: lectureId },
        { lecture_code: lectureId }
      ]
    });
    
    // Enrich lecture info with lecturer name(s)
    let enrichedLectureInfo = null;
    if (lecture) {
      enrichedLectureInfo = { ...lecture };
      
      // Get lecturer name(s) from email(s)
      if (lecture.lecturer_email) {
        const teachersCollection = db.collection('teachers');
        
        // Check if it's an array or a single string
        const lecturerEmails = Array.isArray(lecture.lecturer_email) 
          ? lecture.lecturer_email 
          : [lecture.lecturer_email];
        
        const lecturerNames = await Promise.all(
          lecturerEmails.map(async (email) => {
            const teacher = await teachersCollection.findOne({ 
              $or: [
                { email: email },
                { teacher_email: email }
              ]
            });
            return teacher ? teacher.name : null;
          })
        );
        
        // Filter out null values
        const validNames = lecturerNames.filter(name => name !== null);
        
        if (validNames.length > 0) {
          enrichedLectureInfo.lecturer_name = validNames.join(', '); // Join all names for display
        } else {
          enrichedLectureInfo.lecturer_name = 'N/A';
        }
      } else {
        enrichedLectureInfo.lecturer_name = 'N/A';
      }
    }
    
    // Group students by department/intake
    const csDepartment = attendanceRecords.filter(record => 
      record.intake && (record.intake.includes('CS') || 
      (record.streams && record.streams.includes('CS')))
    );
    
    const seDepartment = attendanceRecords.filter(record => 
      record.intake && (record.intake.includes('SE') || 
      (record.streams && record.streams.includes('SE')))
    );
    
    const ceDepartment = attendanceRecords.filter(record => 
      record.intake && (record.intake.includes('CE') || 
      (record.streams && record.streams.includes('CE')))
    );
    
    // Get total students per department from students collection
    const studentsCollection = db.collection('students');
    const totalCS = await studentsCollection.countDocuments({ intake: 'CS' });
    const totalSE = await studentsCollection.countDocuments({ intake: 'SE' });
    const totalCE = await studentsCollection.countDocuments({ intake: 'CE' });
    
    // Calculate summary
    const summary = {
      total: attendanceRecords.length,
      cs: {
        present: csDepartment.length,
        absent: totalCS - csDepartment.length,
        total: totalCS
      },
      se: {
        present: seDepartment.length,
        absent: totalSE - seDepartment.length,
        total: totalSE
      },
      ce: {
        present: ceDepartment.length,
        absent: totalCE - ceDepartment.length,
        total: totalCE
      }
    };
    
    res.json({
      success: true,
      data: {
        lecture_id: lectureId,
        lecture_info: enrichedLectureInfo,
        date: attendanceRecords[0]?.date || null,
        records: {
          cs: csDepartment,
          se: seDepartment,
          ce: ceDepartment
        },
        summary
      }
    });
    
  } catch (error) {
    console.error('Error fetching attendance by lecture:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// Get attendance records for a specific lecture on a specific date
const getAttendanceByLectureAndDate = async (req, res) => {
  try {
    const { lectureId, date } = req.params;
    
    const db = mongoose.connection.db;
    const attendanceCollection = db.collection('attendance');
    const lecturesCollection = db.collection('lectures');
    
    // Fetch attendance records for specific date
    const attendanceRecords = await attendanceCollection
      .find({ 
        lecture_id: lectureId,
        date: date 
      })
      .sort({ marked_at: 1 })
      .toArray();
    
    // Get lecture details (lectures use lecture_code field)
    const lecture = await lecturesCollection.findOne({ 
      $or: [
        { lecture_id: lectureId },
        { lecture_code: lectureId }
      ]
    });
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    // Get teacher name(s)
    const teachersCollection = db.collection('teachers');
    let lecturerName = 'N/A';
    
    if (lecture.lecturer_email) {
      // Check if it's an array or a single string
      const lecturerEmails = Array.isArray(lecture.lecturer_email) 
        ? lecture.lecturer_email 
        : [lecture.lecturer_email];
      
      const lecturerNames = await Promise.all(
        lecturerEmails.map(async (email) => {
          const teacher = await teachersCollection.findOne({ 
            $or: [
              { email: email },
              { teacher_email: email }
            ]
          });
          return teacher ? teacher.name : null;
        })
      );
      
      // Filter out null values
      const validNames = lecturerNames.filter(name => name !== null);
      
      if (validNames.length > 0) {
        lecturerName = validNames.join(', '); // Join all names for display
      }
    }
    
    // Group students by department
    const csDepartment = attendanceRecords.filter(record => 
      record.intake && (record.intake.includes('CS') || 
      (record.streams && record.streams.includes('CS')))
    );
    
    const seDepartment = attendanceRecords.filter(record => 
      record.intake && (record.intake.includes('SE') || 
      (record.streams && record.streams.includes('SE')))
    );
    
    const ceDepartment = attendanceRecords.filter(record => 
      record.intake && (record.intake.includes('CE') || 
      (record.streams && record.streams.includes('CE')))
    );
    
    // Get total students per department from students collection
    const studentsCollection = db.collection('students');
    const totalCS = await studentsCollection.countDocuments({ intake: 'CS' });
    const totalSE = await studentsCollection.countDocuments({ intake: 'SE' });
    const totalCE = await studentsCollection.countDocuments({ intake: 'CE' });
    
    // Calculate summary
    const summary = {
      total_present: attendanceRecords.length,
      cs: {
        present: csDepartment.length,
        absent: totalCS - csDepartment.length,
        total: totalCS
      },
      se: {
        present: seDepartment.length,
        absent: totalSE - seDepartment.length,
        total: totalSE
      },
      ce: {
        present: ceDepartment.length,
        absent: totalCE - ceDepartment.length,
        total: totalCE
      }
    };
    
    res.json({
      success: true,
      data: {
        lecture_id: lectureId,
        date: date,
        lecture_info: {
          lecture_code: lecture.lecture_id || lecture.lecture_code,
          lecture_name: lecture.lecture_name || lecture.subject,
          start_time: lecture.start_time,
          end_time: lecture.end_time,
          lecturer_name: lecturerName
        },
        attendance: {
          cs: csDepartment,
          se: seDepartment,
          ce: ceDepartment
        },
        summary
      }
    });
    
  } catch (error) {
    console.error('Error fetching attendance by lecture and date:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

module.exports = {
  getAttendanceByLecture,
  getAttendanceByLectureAndDate
};
