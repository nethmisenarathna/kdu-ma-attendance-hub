# Environment Setup Guide for KDU MA Attendance Hub

## 📋 Quick Setup Instructions for Team Members

### 1. Backend Environment Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Copy the environment template:**
   ```bash
   copy .env.example .env
   ```

3. **Edit the `.env` file with your MongoDB credentials:**
   ```properties
   MONGO_URI="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/kdu_auth_demo?retryWrites=true&w=majority&appName=YOUR_CLUSTER_NAME"
   PORT=5000
   NODE_ENV=development
   ```

### 2. Frontend Environment Setup (Optional)

1. **Copy the frontend environment template:**
   ```bash
   copy .env.example .env
   ```

2. **The default values should work for local development:**
   ```properties
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_NAME="KDU MA Attendance Hub"
   REACT_APP_VERSION="1.0.0"
   ```

### 3. MongoDB Setup Options

#### Option A: Use Shared MongoDB Atlas (Recommended for team)
- Use the same cluster credentials as provided
- Each team member uses the same database

#### Option B: Create Individual MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Replace the `MONGO_URI` in your `.env` file

#### Option C: Local MongoDB (Advanced)
```properties
MONGO_URI="mongodb://localhost:27017/kdu_auth_demo"
```

### 4. Installation & Running

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd .. # go back to root
   npm install
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   node src/server.js
   ```
   Should show: `Server running on port 5000` and `MongoDB Connected`

4. **Start the frontend (in a new terminal):**
   ```bash
   npm start
   ```
   Should open browser at `http://localhost:3001`

### 5. Verification

- ✅ Backend: http://localhost:5000 (API endpoints)
- ✅ Frontend: http://localhost:3001 (React app)
- ✅ Database: MongoDB connection successful

### 6. Troubleshooting

**Common Issues:**
- **Port already in use**: Change PORT in `.env` file
- **MongoDB connection failed**: Check MONGO_URI credentials
- **Module not found**: Run `npm install` in the correct directory

### 7. Team Collaboration

**Important Files to Share:**
- `.env.example` files (templates)
- `package.json` files (dependencies)
- Source code files

**Files to NEVER Share:**
- `.env` files (contain sensitive credentials)
- `node_modules/` folders
- Personal MongoDB credentials

### 8. Current Database Collections

The database (`kdu_auth_demo`) contains:
- **students** (96 records)
- **teachers** (42 records)  
- **lectures** (26 records)
- **classSessions** (9 records)
- **attendanceSummaries** (6 records)

---

**Need Help?** Contact the team lead or check the main README.md file.