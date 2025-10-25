const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api', routes);

// Error handler middleware
app.use(errorHandler);

// Add detailed error logging
app.use((err, req, res, next) => {
  console.error('Detailed Error:', err);
  console.error('Stack:', err.stack);
  next(err);
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'KDU Attendance Hub API',
    version: '1.0.0',
    status: 'running'
  });
});

// Simple test route
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log('Unhandled Promise Rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Uncaught Exception. Shutting down...');
  process.exit(1);
});

module.exports = app;