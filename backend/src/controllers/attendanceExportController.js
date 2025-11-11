const mongoose = require('mongoose');
const ExcelJS = require('exceljs');

/**
 * Generate lecture code abbreviation
 * Examples:
 * - "Research Writing Skills" -> "RWS"
 * - "Object-Oriented Programming" -> "OOP"
 * - "Mathematics" -> "MATH" (first 4 letters for single word)
 */
const generateLectureAbbreviation = (subject) => {
  const words = subject.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single word - take first 4 letters uppercase
    return words[0].substring(0, 4).toUpperCase();
  }
  
  // Multiple words - take first letter of each word
  return words
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Export attendance summary as Excel
 * GET /api/attendance/export?stream=CS&startDate=2025-01-01&endDate=2025-12-31
 */
const exportAttendanceSummary = async (req, res) => {
  try {
    const { stream, startDate, endDate } = req.query;
    
    // Validate required parameters
    if (!stream) {
      return res.status(400).json({
        success: false,
        message: 'Stream parameter is required (CS, SE, or CE)'
      });
    }
    
    if (!['CS', 'SE', 'CE'].includes(stream)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stream. Must be CS, SE, or CE'
      });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate parameters are required (YYYY-MM-DD format)'
      });
    }
    
    const db = mongoose.connection.db;
    
    // Get all students for the specified stream, sorted by index_number
    const studentsCollection = db.collection('students');
    const students = await studentsCollection
      .find({ stream: stream })
      .sort({ index_number: 1 })
      .toArray();
    
    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No students found for stream ${stream}`
      });
    }
    
    // Get all lectures for the specified stream - only lectures with 'code' field
    const lecturesCollection = db.collection('lectures');
    const lectures = await lecturesCollection
      .find({ 
        streams: stream,
        code: { $exists: true, $ne: null }
      })
      .sort({ subject: 1 })
      .toArray();
    
    if (lectures.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No lectures found for stream ${stream}`
      });
    }
    
    // Get finalized sessions count for each lecture within date range
    const classSessionsCollection = db.collection('class_sessions');
    const lectureSessionCounts = {};
    
    for (const lecture of lectures) {
      const sessionCount = await classSessionsCollection.countDocuments({
        lecture_id: lecture.lecture_code,
        status: 'finalized',
        date: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      lectureSessionCounts[lecture.lecture_code] = sessionCount;
    }
    
    // Get attendance records for all students and lectures within date range
    const attendanceCollection = db.collection('attendance');
    const attendanceRecords = await attendanceCollection
      .find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .toArray();
    
    // Build attendance map: student_email -> lecture_code -> count
    const attendanceMap = {};
    
    for (const record of attendanceRecords) {
      if (!attendanceMap[record.student_email]) {
        attendanceMap[record.student_email] = {};
      }
      
      if (!attendanceMap[record.student_email][record.lecture_code]) {
        attendanceMap[record.student_email][record.lecture_code] = 0;
      }
      
      attendanceMap[record.student_email][record.lecture_code]++;
    }
    
    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${stream} Attendance Summary`);
    
    // Prepare lecture abbreviations
    const lectureAbbreviations = lectures.map(lecture => ({
      code: lecture.lecture_code,
      abbreviation: generateLectureAbbreviation(lecture.subject),
      subject: lecture.subject,
      sessionCount: lectureSessionCounts[lecture.lecture_code] || 0
    }));
    
    // ROW 1: "No of Lecturing Days for the Period" (merged) + session counts
    const row1 = ['No of Lecturing Days for the Period', '', ''];
    lectureAbbreviations.forEach(lecture => {
      row1.push(lecture.sessionCount);
    });
    row1.push(''); // Overall column
    
    worksheet.addRow(row1);
    
    // Merge first three cells of row 1
    worksheet.mergeCells('A1:C1');
    
    // Style row 1
    const row1Cell = worksheet.getCell('A1');
    row1Cell.font = { bold: true };
    row1Cell.alignment = { horizontal: 'center', vertical: 'middle' };
    row1Cell.border = {
      top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
      right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
    };
    
    // Style session count cells
    for (let i = 4; i <= 3 + lectureAbbreviations.length + 1; i++) {
      const cell = worksheet.getRow(1).getCell(i);
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
      };
    }
    
    // ROW 2: Headers (No, Reg. No., Name, Lecture Abbreviations, Overall)
    const row2 = ['No', 'Reg. No.', 'Name'];
    lectureAbbreviations.forEach(lecture => {
      row2.push(lecture.abbreviation);
    });
    row2.push('Overall');
    
    worksheet.addRow(row2);
    
    // Style row 2 with borders
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
      };
    });
    
    // DATA ROWS: Student attendance data
    students.forEach((student, index) => {
      const rowData = [
        String(index + 1).padStart(2, '0'), // No (01, 02, etc.)
        student.index_number, // Reg. No.
        student.name // Name
      ];
      
      const percentages = [];
      
      // Calculate attendance percentage for each lecture
      lectureAbbreviations.forEach(lecture => {
        const attendanceCount = attendanceMap[student.email]?.[lecture.code] || 0;
        const sessionCount = lecture.sessionCount;
        
        let percentage = 0;
        if (sessionCount > 0) {
          percentage = Math.ceil((attendanceCount / sessionCount) * 100);
        }
        
        percentages.push(percentage);
        rowData.push(percentage);
      });
      
      // Calculate overall percentage (average of all lectures)
      let overall = 0;
      if (percentages.length > 0) {
        const sum = percentages.reduce((acc, val) => acc + val, 0);
        overall = Math.ceil(sum / percentages.length);
      }
      
      rowData.push(overall);
      
      const dataRow = worksheet.addRow(rowData);
      
      // Apply conditional formatting: red text + yellow background if < 80
      lectureAbbreviations.forEach((lecture, lectureIndex) => {
        const cellIndex = 4 + lectureIndex; // Columns start at D (4)
        const cell = dataRow.getCell(cellIndex);
        const percentage = percentages[lectureIndex];
        
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
        };
        
        if (percentage < 80) {
          cell.font = { color: { argb: 'FFFF0000' } }; // Red text
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFEB3B' } // Light yellow background (reduced opacity)
          };
        }
      });
      
      // Apply formatting to overall column
      const overallCell = dataRow.getCell(4 + lectureAbbreviations.length);
      overallCell.alignment = { horizontal: 'center', vertical: 'middle' };
      overallCell.border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
      };
      
      if (overall < 80) {
        overallCell.font = { color: { argb: 'FFFF0000' } }; // Red text
        overallCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFEB3B' } // Light yellow background (reduced opacity)
        };
      }
      
      // Center align No, Reg. No. columns with borders
      dataRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      dataRow.getCell(1).border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
      };
      dataRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
      dataRow.getCell(2).border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
      };
      dataRow.getCell(3).border = {
        top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
      };
    });
    
    // Auto-fit columns
    worksheet.columns.forEach((column, index) => {
      if (index === 2) {
        // Name column - wider
        column.width = 30;
      } else if (index === 1) {
        // Reg. No. column
        column.width = 20;
      } else if (index === 0) {
        // No column
        column.width = 5;
      } else {
        // Lecture and Overall columns
        column.width = 10;
      }
    });
    
    // Set response headers for file download
    const filename = `${stream}_Attendance_Summary_${startDate}_to_${endDate}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting attendance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export attendance summary',
      error: error.message
    });
  }
};

module.exports = {
  exportAttendanceSummary
};
