const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const canSendNotifications = require('../middleware/canSendNotifications');

// All routes require authentication
// Get unread count (must be before /:id route)
router.get('/unread/count', auth, notificationController.getUnreadCount);

// Mark all as read (must be before /:id route)
router.put('/mark-all-read', auth, notificationController.markAllAsRead);

// Create notification (only Kalana & Kaveesha)
router.post('/', auth, canSendNotifications, notificationController.createNotification);

// Get all notifications
router.get('/', auth, notificationController.getNotifications);

// Get single notification
router.get('/:id', auth, notificationController.getNotificationById);

// Mark notification as read
router.put('/:id/read', auth, notificationController.markAsRead);

module.exports = router;
