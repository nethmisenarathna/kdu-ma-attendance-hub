import authService from './authService';

const API_URL = 'http://localhost:5000/api/admin';

class AdminService {
  // Get admin profile
  async getProfile() {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.admin;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update password
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${API_URL}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user in localStorage
      if (data.admin) {
        const currentUser = authService.getUser();
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data.admin }));
      }

      return data.admin;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumber) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength (0-100)
  calculatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(password)) strength += 15;

    return Math.min(strength, 100);
  }

  // Get password strength label
  getPasswordStrengthLabel(strength) {
    if (strength < 40) return { label: 'Weak', color: 'red' };
    if (strength < 70) return { label: 'Medium', color: 'yellow' };
    return { label: 'Strong', color: 'green' };
  }
}

export default new AdminService();
