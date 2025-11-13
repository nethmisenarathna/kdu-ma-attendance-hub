import { API_URL, ENDPOINTS } from '../config';

const API_BASE_URL = API_URL;

export const lectureService = {
  // Get all lectures with lecturer details
  getAllLectures: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lectures`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();
      // The API already returns { success: true, count: 26, data: [...] }
      // So we just return it directly
      return apiResponse;
    } catch (error) {
      console.error('Error fetching lectures:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get lecturer details by email
  getLecturerByEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();
      if (apiResponse.success && apiResponse.data) {
        // Find lecturer by email
        const lecturer = apiResponse.data.find(teacher => teacher.email === email);
        return {
          success: true,
          data: lecturer
        };
      }
      return {
        success: false,
        error: 'Lecturer not found'
      };
    } catch (error) {
      console.error('Error fetching lecturer details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get lecture by ID
  getLectureById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lectures/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching lecture:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get lectures by department
  getLecturesByDepartment: async (department) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lectures?department=${encodeURIComponent(department)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching lectures by department:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get lectures by status
  getLecturesByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lectures?status=${encodeURIComponent(status)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching lectures by status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get today's lecture statistics
  getTodaysLectureStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lectures/stats/today`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();
      return apiResponse;
    } catch (error) {
      console.error('Error fetching today\'s lecture stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
