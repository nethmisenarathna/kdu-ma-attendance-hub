// API Configuration
const getApiUrl = () => {
  // Check if we have an environment variable set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();
export const API_URL = `${API_BASE_URL}/api`;

// Export individual API endpoints
export const ENDPOINTS = {
  AUTH: `${API_URL}/auth`,
  ADMIN: `${API_URL}/admin`,
  STUDENTS: `${API_URL}/students`,
  TEACHERS: `${API_URL}/teachers`,
  LECTURES: `${API_URL}/lectures`,
  ATTENDANCE: `${API_URL}/attendance`,
  DASHBOARD: `${API_URL}/dashboard`,
  STATS: `${API_URL}/stats`,
  NOTIFICATIONS: `${API_URL}/notifications`,
  REPORTS: `${API_URL}/reports`,
  CLASS_SESSIONS: `${API_URL}/class-sessions`,
  ATTENDANCE_SUMMARY: `${API_URL}/attendance-summary`,
};
