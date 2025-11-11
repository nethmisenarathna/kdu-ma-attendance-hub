const { Admin } = require('../models');

// Middleware to check if admin can send notifications
// Only allows kalanakivindu@gmail.com and kaveeshascout@gmail.com
const canSendNotifications = async (req, res, next) => {
  try {
    const adminEmail = req.admin.email;

    // Check if email is one of the authorized senders
    const authorizedEmails = ['kalanakivindu@gmail.com', 'kaveeshascout@gmail.com'];
    
    if (!authorizedEmails.includes(adminEmail)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send notifications'
      });
    }

    // Optionally, also check the can_send_notifications field in database
    const admin = await Admin.findById(req.adminId);
    
    if (!admin || !admin.can_send_notifications) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to send notifications'
      });
    }

    next();
  } catch (error) {
    console.error('canSendNotifications middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking permissions',
      error: error.message
    });
  }
};

module.exports = canSendNotifications;
