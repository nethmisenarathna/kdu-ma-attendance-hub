const API_BASE_URL = 'http://localhost:5000/api';

// Student API Service
export const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get student by index number
  getStudentByIndex: async (indexNumber) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/index/${indexNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // Get students by department
  getStudentsByDepartment: async (department) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/department/${department}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students by department:', error);
      throw error;
    }
  },

  // Get students by intake
  getStudentsByIntake: async (intake) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/intake/${intake}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students by intake:', error);
      throw error;
    }
  }
};

export default studentService;