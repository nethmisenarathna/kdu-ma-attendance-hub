const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Update admin permissions
const updateAdminPermissions = async () => {
  try {
    await connectDB();

    // Get the admin collection directly
    const Admin = mongoose.connection.collection('admin');
    
    // Emails that can send notifications
    const authorizedEmails = ['kalanakivindu@gmail.com', 'kaveeshascout@gmail.com'];
    
    // Update these admins to have can_send_notifications = true
    const result = await Admin.updateMany(
      { email: { $in: authorizedEmails } },
      { $set: { can_send_notifications: true } }
    );
    
    console.log(`\n✓ Updated ${result.modifiedCount} admin(s) with notification permissions`);
    
    // Update all other admins to have can_send_notifications = false
    const otherResult = await Admin.updateMany(
      { email: { $nin: authorizedEmails } },
      { $set: { can_send_notifications: false } }
    );
    
    console.log(`✓ Updated ${otherResult.modifiedCount} other admin(s) to disable notification permissions`);
    
    // Show final status
    const adminsWithPermission = await Admin.find({ can_send_notifications: true }).toArray();
    console.log('\n✓ Admins with notification sending permissions:');
    adminsWithPermission.forEach(admin => {
      console.log(`  - ${admin.name} (${admin.email})`);
    });
    
    process.exit(0);

  } catch (error) {
    console.error('Error updating admin permissions:', error);
    process.exit(1);
  }
};

// Run the script
updateAdminPermissions();
