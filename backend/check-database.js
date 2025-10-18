const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const checkActualDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections in the database
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 Collections in your database:');
    console.log('================================');
    
    if (collections.length === 0) {
      console.log('❌ No collections found in database');
    } else {
      for (const collection of collections) {
        const collectionName = collection.name;
        const count = await db.collection(collectionName).countDocuments();
        console.log(`📁 ${collectionName}: ${count} documents`);
        
        // Show sample document from each collection
        if (count > 0) {
          const sampleDoc = await db.collection(collectionName).findOne();
          console.log(`   Sample structure:`, Object.keys(sampleDoc));
          console.log('   ---');
        }
      }
    }
    
    console.log('\n🔍 Checking specific collections you mentioned:');
    console.log('===============================================');
    
    const expectedCollections = [
      'attendance',
      'attendance_summary', 
      'class_sessions',
      'lectures',
      'students',
      'teachers'
    ];
    
    for (const collectionName of expectedCollections) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`📊 ${collectionName}: ${count} documents`);
        
        if (count > 0) {
          // Show first document structure
          const firstDoc = await db.collection(collectionName).findOne();
          console.log(`   Keys: ${Object.keys(firstDoc).join(', ')}`);
        }
      } catch (error) {
        console.log(`❌ ${collectionName}: Collection not found or error`);
      }
    }
    
    console.log('\n✅ Database analysis complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkActualDatabase();