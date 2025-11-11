/**
 * Test script for attendance export endpoint
 * Run with: node testExport.js
 */

const fs = require('fs');
const path = require('path');

async function testExportEndpoint() {
  console.log('🧪 Testing Attendance Export Endpoint\n');
  
  const testCases = [
    {
      name: 'CS Stream Export',
      url: 'http://localhost:5000/api/attendance/export?stream=CS&startDate=2025-01-01&endDate=2025-12-31',
      filename: 'CS_export_test.xlsx'
    },
    {
      name: 'SE Stream Export',
      url: 'http://localhost:5000/api/attendance/export?stream=SE&startDate=2025-01-01&endDate=2025-12-31',
      filename: 'SE_export_test.xlsx'
    },
    {
      name: 'CE Stream Export',
      url: 'http://localhost:5000/api/attendance/export?stream=CE&startDate=2025-01-01&endDate=2025-12-31',
      filename: 'CE_export_test.xlsx'
    },
    {
      name: 'Custom Date Range (November)',
      url: 'http://localhost:5000/api/attendance/export?stream=CS&startDate=2025-11-01&endDate=2025-11-12',
      filename: 'CS_november_test.xlsx'
    }
  ];

  for (const testCase of testCases) {
    console.log(`📊 ${testCase.name}`);
    console.log(`   URL: ${testCase.url}`);
    
    try {
      const response = await fetch(testCase.url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`   ❌ Failed: ${response.status} ${response.statusText}`);
        console.log(`   Error: ${errorText}\n`);
        continue;
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('spreadsheetml')) {
        console.log(`   ⚠️  Warning: Unexpected content type: ${contentType}`);
      }
      
      // Save the file
      const buffer = await response.arrayBuffer();
      const outputPath = path.join(__dirname, testCase.filename);
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      const fileSizeKB = (buffer.byteLength / 1024).toFixed(2);
      console.log(`   ✅ Success: Downloaded ${fileSizeKB} KB`);
      console.log(`   📁 Saved to: ${outputPath}\n`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('✨ Testing complete!');
}

// Run the tests
testExportEndpoint().catch(console.error);
