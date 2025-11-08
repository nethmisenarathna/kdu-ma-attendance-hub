const API_BASE_URL = 'http://localhost:5000/api';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();
      return apiResponse;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
