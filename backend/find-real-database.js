const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const exploreRealDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB cluster!');
    
    // Check the kdu_auth_demo database specifically
    const baseUri = process.env.MONGO_URI.replace(/\/[^\/]*\?/, '/kdu_auth_demo?');
    await mongoose.disconnect();
    
    console.log('\n🔍 Checking kdu_auth_demo database for your real data...');
    await mongoose.connect(baseUri);
    
    const db = mongoose.connection.db;
    const dbName = mongoose.connection.db.databaseName;
    console.log('🗄️ Now connected to database:', dbName);
    
    // List collections in kdu_auth_demo
    const collections = await db.listCollections().toArray();
    console.log('\n📂 Collections in kdu_auth_demo:');
    
    let totalRecords = 0;
    let realDataFound = false;
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      totalRecords += count;
      
      console.log(`\n📁 Collection: "${collectionName}"`);
      console.log(`   📊 Total Documents: ${count}`);
      
      if (count > 50) {
        realDataFound = true;
        console.log(`   🎯 LARGE COLLECTION FOUND! This might be your real data!`);
      }
      
      if (count > 0) {
        // Get sample documents
        const samples = await db.collection(collectionName).find({}).limit(2).toArray();
        console.log(`   🔍 Sample Document Structure:`, Object.keys(samples[0]));
        
        // Show first document data (partial)
        const firstDoc = samples[0];
        const sampleData = {};
        Object.keys(firstDoc).slice(0, 5).forEach(key => {
          if (key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
            sampleData[key] = firstDoc[key];
          }
        });
        console.log(`   📝 Sample Data:`, sampleData);
      }
    }
    
    console.log(`\n📈 TOTAL RECORDS in kdu_auth_demo: ${totalRecords}`);
    
    if (totalRecords >= 100) {
      console.log('\n🎉 FOUND YOUR REAL DATABASE WITH 100+ RECORDS!');
      console.log('The API should connect to kdu_auth_demo database, not test database.');
    } else {
      console.log('\n🤔 Still not finding 100+ records. Let me check all databases...');
      
      // Check other databases
      const admin = db.admin();
      const dbList = await admin.listDatabases();
      
      for (const database of dbList.databases) {
        if (database.name !== 'admin' && database.name !== 'local' && database.name !== 'test' && database.name !== 'kdu_auth_demo') {
          console.log(`\n🔍 Checking database: ${database.name}`);
          const dbUri = process.env.MONGO_URI.replace(/\/[^\/]*\?/, `/${database.name}?`);
          
          await mongoose.disconnect();
          await mongoose.connect(dbUri);
          
          const testDb = mongoose.connection.db;
          const testCollections = await testDb.listCollections().toArray();
          let dbTotal = 0;
          
          for (const col of testCollections) {
            const colCount = await testDb.collection(col.name).countDocuments();
            dbTotal += colCount;
          }
          
          console.log(`   📊 Total records in ${database.name}: ${dbTotal}`);
          if (dbTotal >= 100) {
            console.log(`   🎯 FOUND YOUR REAL DATA IN: ${database.name}!`);
            realDataFound = true;
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error exploring databases:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database exploration complete!');
    process.exit(0);
  }
};

// Run the exploration
exploreRealDatabase();