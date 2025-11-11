const { Lecture } = require('../models');
const { ClassSession } = require('../models');
const { Student } = require('../models');

// Helper function to get current week's date range (Monday to Sunday) in Sri Lanka timezone
const getWeekDateRange = () => {
  const now = new Date();
  
  // Convert to Sri Lanka time (UTC+5:30)
  const sriLankaOffset = 5.5 * 60; // 5.5 hours in minutes
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const sriLankaTime = new Date(utcTime + (sriLankaOffset * 60000));
  
  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const currentDay = sriLankaTime.getDay();
  
  // Calculate days to subtract to get to Monday (day 1)
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  
  // Get Monday (start of week)
  const monday = new Date(sriLankaTime);
  monday.setDate(monday.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  
  // Get Sunday (end of week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    start: monday,
    end: sunday,
    startStr: formatDateToString(monday),
    endStr: formatDateToString(sunday)
  };
};

// Helper function to format date to YYYY-MM-DD string
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get all days of current week
const getCurrentWeekDays = () => {
  const { start } = getWeekDateRange();
  const days = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dayOfWeek = date.getDay();
    days.push(dayNames[dayOfWeek]);
  }
  
  return days;
};

// @desc    Calculate completion rate for current week
// @route   GET /api/stats/completion-rate
// @access  Public (or Protected based on your needs)
exports.getCompletionRate = async (req, res) => {
  try {
    const { startStr, endStr } = getWeekDateRange();
    const weekDays = getCurrentWeekDays();
    
    // Get total lectures scheduled for this week based on day_of_week
    const totalLectures = await Lecture.countDocuments({
      day_of_week: { $in: weekDays }
    });
    
    // Get finalized sessions for this week
    const finalizedSessions = await ClassSession.countDocuments({
      date: {
        $gte: startStr,
        $lte: endStr
      },
      status: 'finalized'
    });
    
    // Calculate completion rate
    const completionRate = totalLectures > 0 
      ? ((finalizedSessions / totalLectures) * 100).toFixed(1)
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        completionRate: parseFloat(completionRate),
        completionRateText: `${completionRate}%`,
        totalScheduled: totalLectures,
        totalFinalized: finalizedSessions,
        weekRange: {
          start: startStr,
          end: endStr
        }
      }
    });
    
  } catch (error) {
    console.error('Get completion rate error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating completion rate',
      error: error.message
    });
  }
};

// @desc    Get all dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Public (or Protected)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total students
    const totalStudents = await Student.countDocuments();
    
    // Get total courses (lectures)
    const totalCourses = await Lecture.countDocuments();
    
    // Get completion rate
    const { startStr, endStr } = getWeekDateRange();
    const weekDays = getCurrentWeekDays();
    
    const totalLectures = await Lecture.countDocuments({
      day_of_week: { $in: weekDays }
    });
    
    const finalizedSessions = await ClassSession.countDocuments({
      date: {
        $gte: startStr,
        $lte: endStr
      },
      status: 'finalized'
    });
    
    const completionRate = totalLectures > 0 
      ? ((finalizedSessions / totalLectures) * 100).toFixed(1)
      : 0;
    
    // Calculate changes (for now, showing static values - can be enhanced later)
    res.status(200).json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          changeText: '+12% from last month',
          changeType: 'positive'
        },
        courses: {
          total: totalCourses,
          changeText: `${totalCourses} total courses`,
          changeType: 'neutral'
        },
        completionRate: {
          value: `${completionRate}%`,
          numericValue: parseFloat(completionRate),
          changeText: `${finalizedSessions}/${totalLectures} completed`,
          changeType: parseFloat(completionRate) >= 80 ? 'positive' : parseFloat(completionRate) >= 60 ? 'neutral' : 'negative',
          weekRange: {
            start: startStr,
            end: endStr
          }
        },
        avgAttendance: {
          value: 'N/A',
          changeText: 'Coming soon',
          changeType: 'neutral'
        }
      }
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get weekly completion trend
// @route   GET /api/stats/weekly-trend
// @access  Public
exports.getWeeklyTrend = async (req, res) => {
  try {
    const { startStr, endStr, start } = getWeekDateRange();
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const trend = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = formatDateToString(currentDate);
      const dayName = dayNames[i];
      
      // Get scheduled lectures for this day
      const scheduledCount = await Lecture.countDocuments({
        day_of_week: dayName
      });
      
      // Get finalized sessions for this day
      const finalizedCount = await ClassSession.countDocuments({
        date: dateStr,
        status: 'finalized'
      });
      
      trend.push({
        day: dayName,
        date: dateStr,
        scheduled: scheduledCount,
        finalized: finalizedCount,
        rate: scheduledCount > 0 ? ((finalizedCount / scheduledCount) * 100).toFixed(1) : 0
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        weekRange: { start: startStr, end: endStr },
        trend
      }
    });
    
  } catch (error) {
    console.error('Get weekly trend error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly trend',
      error: error.message
    });
  }
};
