import authService from './authService';

const API_URL = 'http://localhost:5000/api/notifications';

class NotificationService {
  // Create a new notification (send message)
  async createNotification(title, message, priority = 'medium', type = 'info') {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
        body: JSON.stringify({ title, message, priority, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send notification');
      }

      return data;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Get all notifications with optional filter
  async getNotifications(filter = 'all') {
    try {
      const url = filter !== 'all' ? `${API_URL}?filter=${filter}` : API_URL;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      // Return just the notifications array
      return data.data?.notifications || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  // Get single notification by ID
  async getNotificationById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notification');
      }

      return data.notification;
    } catch (error) {
      console.error('Get notification by ID error:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(id) {
    try {
      const response = await fetch(`${API_URL}/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark as read');
      }

      return data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await fetch(`${API_URL}/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark all as read');
      }

      return data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await fetch(`${API_URL}/unread/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get unread count');
      }

      return data.count;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }

  // Check if current user can send notifications
  canSendNotifications() {
    const user = authService.getUser();
    const authorizedEmails = ['kalanakivindu@gmail.com', 'kaveeshascout@gmail.com'];
    return user && authorizedEmails.includes(user.email.toLowerCase());
  }
}

export default new NotificationService();
