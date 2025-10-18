const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const exploreDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to your MongoDB database!');
    console.log('📊 Database URL:', process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@'));
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📂 Collections in your database:');
    
    if (collections.length === 0) {
      console.log('   No collections found. Your database might be empty.');
    } else {
      for (const collection of collections) {
        const collectionName = collection.name;
        const count = await db.collection(collectionName).countDocuments();
        console.log(`   📁 ${collectionName}: ${count} documents`);
        
        // Show sample document from each collection
        if (count > 0) {
          const sample = await db.collection(collectionName).findOne();
          console.log(`      Sample document structure:`, Object.keys(sample));
        }
      }
    }
    
    // Check for the specific collections we expect
    console.log('\n🔍 Checking for expected collections:');
    const expectedCollections = ['attendance', 'attendance_summary', 'class_sessions', 'lectures', 'students', 'teachers'];
    
    for (const expectedCol of expectedCollections) {
      const exists = collections.some(col => col.name === expectedCol);
      const plural = expectedCol + 's';
      const existsPlural = collections.some(col => col.name === plural);
      
      if (exists) {
        const count = await db.collection(expectedCol).countDocuments();
        console.log(`   ✅ ${expectedCol}: ${count} documents`);
      } else if (existsPlural) {
        const count = await db.collection(plural).countDocuments();
        console.log(`   ✅ ${plural}: ${count} documents`);
      } else {
        console.log(`   ❌ ${expectedCol}: Not found`);
      }
    }
    
    console.log('\n🌐 Your API endpoints are ready at:');
    console.log('   http://localhost:5000/api/teachers');
    console.log('   http://localhost:5000/api/students');
    console.log('   http://localhost:5000/api/lectures');
    console.log('   http://localhost:5000/api/class-sessions');
    console.log('   http://localhost:5000/api/attendance');
    console.log('   http://localhost:5000/api/attendance-summary');
    
  } catch (error) {
    console.error('❌ Error exploring database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database exploration complete!');
    process.exit(0);
  }
};

// Run the exploration
exploreDatabase();