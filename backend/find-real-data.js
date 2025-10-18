const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const findRealData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to your MongoDB database!');
    
    // Get database instance
    const db = mongoose.connection.db;
    const dbName = mongoose.connection.db.databaseName;
    console.log('🗄️ Database Name:', dbName);
    
    // List ALL collections with detailed info
    const collections = await db.listCollections().toArray();
    console.log('\n📂 ALL Collections in your database:');
    
    let totalRecords = 0;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      totalRecords += count;
      
      console.log(`\n📁 Collection: "${collectionName}"`);
      console.log(`   📊 Total Documents: ${count}`);
      
      if (count > 0) {
        // Get first few documents to understand structure
        const samples = await db.collection(collectionName).find({}).limit(2).toArray();
        console.log(`   🔍 Sample Document Structure:`, Object.keys(samples[0]));
        
        // Show first document data (partial)
        const firstDoc = samples[0];
        console.log(`   📝 Sample Data:`, {
          _id: firstDoc._id,
          ...(firstDoc.name ? { name: firstDoc.name } : {}),
          ...(firstDoc.firstName ? { firstName: firstDoc.firstName } : {}),
          ...(firstDoc.studentId ? { studentId: firstDoc.studentId } : {}),
          ...(firstDoc.teacherId ? { teacherId: firstDoc.teacherId } : {}),
          ...(firstDoc.title ? { title: firstDoc.title } : {}),
          ...(firstDoc.email ? { email: firstDoc.email } : {}),
        });
      }
    }
    
    console.log(`\n📈 TOTAL RECORDS ACROSS ALL COLLECTIONS: ${totalRecords}`);
    
    // Check if there are other databases
    const admin = db.admin();
    try {
      const dbList = await admin.listDatabases();
      console.log('\n🗂️ ALL DATABASES in your MongoDB cluster:');
      dbList.databases.forEach(database => {
        console.log(`   💽 ${database.name} (${(database.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
      });
    } catch (error) {
      console.log('⚠️ Could not list all databases (permission needed)');
    }
    
    // Search for collections that might contain your real data
    console.log('\n🔍 SEARCHING FOR YOUR REAL DATA...');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      if (count >= 50) { // Looking for collections with significant data
        console.log(`\n🎯 LARGE COLLECTION FOUND: "${collection.name}" with ${count} records`);
        
        // Sample some real data from large collections
        const realSamples = await db.collection(collection.name).find({}).limit(3).toArray();
        console.log(`   Real Data Sample:`, realSamples.map(doc => ({
          _id: doc._id,
          ...Object.fromEntries(
            Object.entries(doc).slice(1, 6) // Show first 5 fields after _id
          )
        })));
      }
    }
    
  } catch (error) {
    console.error('❌ Error exploring database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database exploration complete!');
    process.exit(0);
  }
};

// Run the exploration
findRealData();