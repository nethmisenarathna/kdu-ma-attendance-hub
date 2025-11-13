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

// Hash existing passwords
const hashExistingPasswords = async () => {
  try {
    await connectDB();

    // Show database name
    console.log('Connected to database:', mongoose.connection.db.databaseName);

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Get the admin collection directly
    const Admin = mongoose.connection.collection('admin');
    
    // Count documents
    const count = await Admin.countDocuments();
    console.log(`\nTotal documents in 'admin' collection: ${count}`);
    
    // Find all admins
    const admins = await Admin.find({}).toArray();
    
    console.log(`Found ${admins.length} admin(s) in database`);

    if (admins.length === 0) {
      console.log('\n⚠️  No documents found in admin collection.');
      console.log('This might mean:');
      console.log('  1. The collection is empty');
      console.log('  2. You are connected to a different database');
      console.log('  3. The collection name is different\n');
      process.exit(0);
    }

    for (const admin of admins) {
      console.log(`\nProcessing: ${admin.name} (${admin.email})`);
      
      // Check if password looks like it's already hashed (bcrypt hashes start with $2a$ or $2b$)
      if (admin.password && !admin.password.startsWith('$2')) {
        console.log(`  Current password: ${admin.password}`);
        console.log(`  Hashing...`);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);
        
        // Update the admin with hashed password
        await Admin.updateOne(
          { _id: admin._id },
          { 
            $set: { 
              password: hashedPassword,
              failedLoginAttempts: 0
            }
          }
        );
        
        console.log(`  ✓ Password hashed successfully!`);
      } else {
        console.log(`  Password already hashed.`);
      }
    }

    console.log('\n✓ All passwords processed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error hashing passwords:', error);
    process.exit(1);
  }
};

// Run the script
hashExistingPasswords();
