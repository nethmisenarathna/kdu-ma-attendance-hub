# 🎓 KDU MA Attendance Hub

A modern web application for managing student attendance at KDU (Kotelawala Defence University). Built with React.js frontend and Node.js/Express backend with MongoDB Atlas database integration.

![KDU Attendance Hub](https://img.shields.io/badge/Status-Active-green) ![Node.js](https://img.shields.io/badge/Node.js-22.16.0-green) ![React](https://img.shields.io/badge/React-18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

- 👥 **Student Management** - Complete student database with search and filtering
- 👨‍🏫 **Lecturer Management** - Faculty profiles with detailed information
- 📚 **Lecture Scheduling** - Course management with lecturer integration
- 📊 **Dashboard Analytics** - Real-time statistics and overview
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile
- 🔍 **Advanced Search** - Filter by department, intake, stream, and more
- 📋 **Data Export** - Export functionality for reports and analytics

## 🛠 Tech Stack

**Frontend:**
- React.js 18+ with Create React App
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation

**Backend:**
- Node.js with Express.js framework
- MongoDB Atlas for cloud database
- Mongoose for object modeling
- CORS for cross-origin requests
- dotenv for environment management

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v22.16.0 or higher)
- [Git](https://git-scm.com/)
- A code editor (VS Code recommended)

### 📋 Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/nethmisenarathna/kdu-ma-attendance-hub.git
cd kdu-ma-attendance-hub
```

#### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install backend dependencies:
```bash
npm install
```

#### 3. Environment Configuration

Copy the environment example file:
```bash
# Windows (PowerShell/CMD)
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
# MongoDB Atlas Connection
MONGO_URI="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority"

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important:** Replace the MongoDB URI with your actual credentials:
- `your-username`: Your MongoDB Atlas username
- `your-password`: Your MongoDB Atlas password
- `your-cluster`: Your cluster identifier
- `your-database`: Your database name (e.g., `kdu_auth_demo`)

#### 4. Frontend Setup

Navigate back to the main directory:
```bash
cd ..
```

Install frontend dependencies:
```bash
npm install
```

#### 5. Start the Application

**Start Backend Server (Terminal 1):**
```bash
cd backend
node src\server.js
```

Expected output:
```
[dotenv@17.2.3] injecting env (3) from .env
Server running in development mode on port 5000
MongoDB Connected: your-cluster.mongodb.net
```

**Start Frontend Application(main directory) (Terminal 2):**
```bash
npm start
```

Expected output:
```
Compiled successfully!
Local:            http://localhost:3001
On Your Network:  http://192.168.x.x:3001
```

#### 6. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
kdu-ma-attendance-hub/
├── 📁 public/                    # Static assets
│   ├── index.html               # Main HTML file
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots file
├── 📁 src/                      # React frontend source
│   ├── 📁 components/           # Reusable UI components
│   │   ├── AppSidebar.js        # Navigation sidebar
│   │   ├── StatsCard.js         # Dashboard statistics cards
│   │   ├── StatusBadge.js       # Status indicator component
│   │   └── UserProfile.js       # User profile component
│   ├── 📁 pages/               # Main page components
│   │   ├── Dashboard.js         # Dashboard overview  
│   │   ├── Students.js          # Student management
│   │   ├── Lecturers.js         # Lecturer management
│   │   ├── Lectures.js          # Lecture scheduling
│   │   ├── Reports.js           # Analytics and reports
│   │   └── Login.js             # Authentication
│   ├── 📁 services/            # API service layers
│   │   ├── studentService.js    # Student API calls
│   │   ├── lecturerService.js   # Lecturer API calls
│   │   └── lectureService.js    # Lecture API calls
│   ├── 📁 lib/                 # Utility libraries
│   └── 📁 assets/              # Images and static files
├── 📁 backend/                  # Node.js backend
│   ├── 📁 src/                 # Backend source code
│   │   ├── 📁 config/          # Configuration files
│   │   │   └── database.js      # MongoDB connection
│   │   ├── 📁 controllers/     # Route controllers
│   │   │   ├── studentController.js      # Student operations
│   │   │   ├── teacherController.js      # Teacher operations
│   │   │   └── lectureController.js      # Lecture operations
│   │   ├── 📁 middleware/      # Custom middleware
│   │   │   ├── errorHandler.js  # Error handling
│   │   │   └── logger.js        # Request logging
│   │   ├── 📁 models/          # Database schemas
│   │   │   ├── Student.js       # Student model
│   │   │   ├── Teacher.js       # Teacher model
│   │   │   └── Lecture.js       # Lecture model
│   │   ├── 📁 routes/          # API route definitions
│   │   │   ├── students.js      # Student routes
│   │   │   ├── teachers.js      # Teacher routes
│   │   │   └── lectures.js      # Lecture routes
│   │   ├── 📁 utils/           # Utility functions
│   │   └── server.js           # Main server file
│   ├── .env.example            # Environment template
│   ├── package.json            # Backend dependencies
│   └── start-server.bat        # Windows start script
├── package.json                # Frontend dependencies
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This file
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (development)
npm run seed       # Seed database with sample data
```

## 🌐 API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/index/:indexNumber` - Get student by index
- `GET /api/students/department/:department` - Get students by department
- `GET /api/students/intake/:intake` - Get students by intake

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `GET /api/teachers/department/:department` - Get teachers by department

### Lectures
- `GET /api/lectures` - Get all lectures
- `GET /api/lectures/:id` - Get lecture by ID
- `GET /api/lectures/department/:department` - Get lectures by department

## 🗄 Database Schema

### Student Model
```javascript
{
  index_number: String (unique),
  name: String,
  email: String (unique),
  department: String,
  intake: String,
  stream: String,
  password: String
}
```

### Teacher Model
```javascript
{
  name: String,
  email: String (unique),
  department: String,
  employee_id: String,
  phone: String,
  office: String,
  qualification: String
}
```

### Lecture Model
```javascript
{
  lecture_code: String,
  subject: String,
  intake: String,
  streams: [String],
  day_of_week: String,
  start_time: String,
  end_time: String,
  location: String,
  lecturer_email: String
}
```

## 🎨 UI Features

### Responsive Design
- **Desktop (lg+):** Full table layout with all columns
- **Tablet (md-lg):** Compact table with horizontal scrolling
- **Mobile (<md):** Card-based layout optimized for touch

### Interactive Components
- Advanced search and filtering
- Sortable table columns
- Clickable lecturer profiles
- Real-time data loading
- Loading states and error handling

## 🔍 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check if you're in the backend directory
cd backend
pwd

# Verify environment variables
cat .env    # Linux/Mac
type .env   # Windows

# Check MongoDB connection
node src\server.js
```

**Frontend won't start:**
```bash
# Install dependencies
npm install

# Clear cache and restart
npm start
```

**Port conflicts:**
- Backend uses port 5000
- Frontend uses port 3001 (or 3000)
- If ports are busy, the application will suggest alternatives

**Database connection issues:**
- Verify MongoDB Atlas credentials in `.env`
- Check network connectivity
- Ensure database user has proper permissions
- Whitelist your IP address in MongoDB Atlas

### Environment Variables Checklist

Ensure your `.env` file contains:
- ✅ Valid MongoDB URI with correct credentials
- ✅ Correct database name
- ✅ PORT set to 5000
- ✅ NODE_ENV set to development

## 📊 Sample Data

The application comes with real sample data:
- **96 Students** across multiple departments and intakes
- **42 Teachers** with complete profile information
- **26 Lectures** with scheduled times and locations
- **Real relationships** between lecturers and their courses

## 🚀 Quick Start Commands

**Create a batch file (`start-website.bat`) for easy startup:**
```batch
@echo off
echo Starting KDU MA Attendance Hub...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d %~dp0backend && node src\server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Application...
start "Frontend" cmd /k "cd /d %~dp0 && npm start"

echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3001
echo.
pause
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Nethmi Senarathna** - *Initial work* - [nethmisenarathna](https://github.com/nethmisenarathna)

## 🙏 Acknowledgments

- KDU (Kotelawala Defence University) for project requirements
- React.js and Node.js communities for excellent documentation
- MongoDB Atlas for reliable cloud database services
- Tailwind CSS for beautiful, responsive design system

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/nethmisenarathna/kdu-ma-attendance-hub/issues) section
2. Create a new issue with detailed description
3. Include error messages and system information

---

**Happy coding! 🚀**
