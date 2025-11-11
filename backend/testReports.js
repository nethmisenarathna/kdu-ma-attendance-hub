/**
 * Test script for reports endpoints
 */

async function testReportsEndpoints() {
  console.log('🧪 Testing Reports Endpoints\n');
  
  // Test 1: Get Stats
  console.log('1️⃣ Testing GET /api/reports/stats');
  try {
    const response = await fetch('http://localhost:5000/api/reports/stats');
    const data = await response.json();
    console.log('   ✅ Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  console.log('');
  
  // Test 2: Generate Report
  console.log('2️⃣ Testing POST /api/reports/generate (Attendance Summary)');
  try {
    const response = await fetch('http://localhost:5000/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'attendance_summary',
        stream: 'CS',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      })
    });
    const data = await response.json();
    console.log('   ✅ Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  console.log('');
  
  // Test 3: Generate Monthly Report
  console.log('3️⃣ Testing POST /api/reports/generate (Monthly Summary)');
  try {
    const response = await fetch('http://localhost:5000/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'monthly_summary',
        stream: 'SE',
        month: 11,
        year: 2025
      })
    });
    const data = await response.json();
    console.log('   ✅ Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  console.log('');
  
  // Test 4: Check Stats Again
  console.log('4️⃣ Testing GET /api/reports/stats (After Generating)');
  try {
    const response = await fetch('http://localhost:5000/api/reports/stats');
    const data = await response.json();
    console.log('   ✅ Success:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  console.log('');
  
  console.log('✨ Testing complete!');
}

testReportsEndpoints().catch(console.error);
