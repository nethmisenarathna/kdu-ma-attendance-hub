const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Create admin user
const createAdmin = async () => {
  try {
    await connectDB();

    // Get the admin collection directly
    const Admin = mongoose.connection.collection('admin');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'kalanakivindu@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists with email: kalanakivindu@gmail.com');
      
      // Check if password is already hashed
      if (!existingAdmin.password.startsWith('$2')) {
        console.log('Password is not hashed. Hashing it now...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(existingAdmin.password, salt);
        
        await Admin.updateOne(
          { _id: existingAdmin._id },
          { 
            $set: { 
              password: hashedPassword,
              failedLoginAttempts: 0
            }
          }
        );
        
        console.log('✓ Password hashed successfully for existing admin!');
      } else {
        console.log('Password is already hashed.');
      }
      
      process.exit(0);
    }

    // Create new admin if doesn't exist
    console.log('Creating new admin user...');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('kalana123', salt);
    
    const adminData = {
      name: 'Kalana Kivindu',
      email: 'kalanakivindu@gmail.com',
      password: hashedPassword,
      role: 'Developer',
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await Admin.insertOne(adminData);
    
    console.log('\n✓ Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('  Email: kalanakivindu@gmail.com');
    console.log('  Password: kalana123');
    console.log('\n⚠️  Please change this password after first login!\n');
    
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script
createAdmin();
