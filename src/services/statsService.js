const API_URL = 'http://localhost:5000/api/stats';

class StatsService {
  // Get completion rate for current week
  async getCompletionRate() {
    try {
      const response = await fetch(`${API_URL}/completion-rate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch completion rate');
      }

      return data.data;
    } catch (error) {
      console.error('Get completion rate error:', error);
      throw error;
    }
  }

  // Get all dashboard statistics
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  // Get weekly completion trend
  async getWeeklyTrend() {
    try {
      const response = await fetch(`${API_URL}/weekly-trend`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch weekly trend');
      }

      return data.data;
    } catch (error) {
      console.error('Get weekly trend error:', error);
      throw error;
    }
  }
}

export default new StatsService();
