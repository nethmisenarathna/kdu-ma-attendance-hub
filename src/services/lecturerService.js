import { API_URL, ENDPOINTS } from '../config';

const API_BASE_URL = API_URL;

// Lecturer API Service
export const lecturerService = {
  // Get all lecturers/teachers
  getAllLecturers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      throw error;
    }
  },

  // Get lecturer by email
  getLecturerByEmail: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/email/${email}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lecturer:', error);
      throw error;
    }
  },

  // Get lecturers by department
  getLecturersByDepartment: async (department) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/department/${department}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lecturers by department:', error);
      throw error;
    }
  }
};

export default lecturerService;