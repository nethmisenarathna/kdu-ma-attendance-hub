const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get attendance records for a specific lecture
 * @param {string} lectureId - The lecture ID
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 * @returns {Promise} Attendance data
 */
export const getAttendanceByLecture = async (lectureId, date = null) => {
  try {
    let url = `${API_BASE_URL}/attendance/lecture/${lectureId}`;
    if (date) {
      url += `?date=${date}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch attendance');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching attendance by lecture:', error);
    throw error;
  }
};

/**
 * Get attendance records for a specific lecture on a specific date
 * @param {string} lectureId - The lecture ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise} Attendance data
 */
export const getAttendanceByLectureAndDate = async (lectureId, date) => {
  try {
    const url = `${API_BASE_URL}/attendance/lecture/${lectureId}/date/${date}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch attendance');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching attendance by lecture and date:', error);
    throw error;
  }
};

const attendanceService = {
  getAttendanceByLecture,
  getAttendanceByLectureAndDate
};

export default attendanceService;
