const API_URL = 'http://localhost:5000/api/auth';

class AuthService {
  // Login user
  async login(email, password, rememberMe = false) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user info in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      if (data.admin) {
        localStorage.setItem('user', JSON.stringify(data.admin));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        credentials: 'include',
      });

      // Clear local storage regardless of response
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if request fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user');
      }

      // Update stored user info
      if (data.admin) {
        localStorage.setItem('user', JSON.stringify(data.admin));
      }

      return data.admin;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Verify token
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Verify token error:', error);
      return false;
    }
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Get user from localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get auth header for API requests
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export default new AuthService();
