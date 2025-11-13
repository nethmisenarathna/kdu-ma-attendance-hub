const { Notification } = require('../models');
const { Admin } = require('../models');

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private (only Kalana & Kaveesha)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, priority, type } = req.body;
    const senderEmail = req.admin.email;
    const senderName = req.admin.name;

    // Validate input
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Validate title length
    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Title must be 200 characters or less'
      });
    }

    // Validate message length
    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be 1000 characters or less'
      });
    }

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create notification
    const notification = await Notification.create({
      title,
      message,
      sender_email: senderEmail,
      sender_name: senderName,
      priority: priority || 'medium',
      type: type || 'info',
      expires_at: expiresAt
    });

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification: {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        type: notification.type,
        created_at: notification.createdAt
      }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// @desc    Get all notifications (for current admin)
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { filter } = req.query; // 'all', 'read', 'unread'

    let query = {};

    // Apply filter
    if (filter === 'read') {
      query.is_read = true;
    } else if (filter === 'unread') {
      query.is_read = false;
    }

    // Get notifications sorted by newest first
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    // Get counts
    const totalCount = await Notification.countDocuments();
    const unreadCount = await Notification.countDocuments({ is_read: false });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        counts: {
          total: totalCount,
          unread: unreadCount,
          read: totalCount - unreadCount
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// @desc    Get single notification by ID
// @route   GET /api/notifications/:id
// @access  Private
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Mark as read
    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { is_read: false },
      { 
        $set: { 
          is_read: true,
          read_at: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marked as read`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ is_read: false });

    res.status(200).json({
      success: true,
      count: unreadCount
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting unread count',
      error: error.message
    });
  }
};
