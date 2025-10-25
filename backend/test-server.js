const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({
    message: 'Simple test server working',
    timestamp: new Date().toISOString()
  });
});

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

const PORT = 5001; // Use different port to avoid conflicts

const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});