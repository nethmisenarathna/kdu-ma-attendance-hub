@echo off
cd /d "D:\kdu-ma-attendance-hub\backend"
echo Starting KDU Attendance Hub Backend Server...
echo.
echo Server will run at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
node src\server.js
pause