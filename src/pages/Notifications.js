import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Info, Calendar } from 'lucide-react';
import notificationService from '../services/notificationService';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await notificationService.getNotifications(filter);
      // Ensure data is always an array
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
      setNotifications([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setError(err.message || 'Failed to mark all as read');
    }
  };

  const toggleExpand = (id, isRead) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Mark as read when expanding
      if (!isRead) {
        handleMarkAsRead(id);
      }
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            Show:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Mark All as Read
            </span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Bell className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-2 text-gray-600">
            {filter === 'unread' ? "You don't have any unread notifications" :
             filter === 'read' ? "You don't have any read notifications" :
             "You don't have any notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification._id}
              onClick={() => toggleExpand(notification._id, notification.is_read)}
              className={`rounded-lg border p-4 cursor-pointer transition-all ${
                notification.is_read
                  ? 'bg-gray-50 hover:bg-gray-100'
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`font-semibold ${notification.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    {getPriorityBadge(notification.priority)}
                  </div>
                  
                  {/* Preview or Full Message */}
                  <p className={`text-sm mt-2 ${notification.is_read ? 'text-gray-600' : 'text-gray-700'}`}>
                    {expandedId === notification._id
                      ? notification.message
                      : notification.message.length > 100
                        ? `${notification.message.substring(0, 100)}...`
                        : notification.message
                    }
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>{formatDate(notification.created_at)}</span>
                    <span>•</span>
                    <span className="capitalize">{notification.type}</span>
                    {!notification.is_read && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">New</span>
                      </>
                    )}
                  </div>

                  {/* Sender Info */}
                  <div className="mt-2 text-xs text-gray-500">
                    From: {notification.sender?.name || 'System'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}