# 🚀 KDU MA Attendance Hub - Deployment Guide

## 📋 Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at: https://www.mongodb.com/cloud/atlas
   - Create a cluster (Free M0 tier is sufficient)
   - Get your connection string

2. **Render Account** (Free tier available)
   - Sign up at: https://render.com
   - No credit card required for free tier

3. **GitHub Repository**
   - Push your code to GitHub (if not already done)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create Database**
   - Log in to MongoDB Atlas
   - Click "Create" → "Cluster"
   - Choose Free Tier (M0)
   - Select region closest to Singapore
   - Wait for cluster creation (~5 minutes)

2. **Configure Network Access**
   - Go to "Network Access" in sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `kdu-admin` (or your choice)
   - Password: Generate strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://kdu-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://...mongodb.net/kdu-attendance?retryWrites=true&w=majority`

---

## 🚀 Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `kdu-ma-attendance-hub` repo

3. **Configure Backend Service**
   - **Name**: `kdu-attendance-backend`
   - **Region**: Singapore (or closest)
   - **Branch**: `newBranch` (or your main branch)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars_long
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   FRONTEND_URL=https://kdu-attendance-hub.onrender.com
   ```
   
   **Generate JWT_SECRET**:
   ```bash
   # On PowerShell, run:
   [Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (~5 minutes)
   - Note your backend URL: `https://kdu-attendance-backend.onrender.com`

6. **Verify Backend**
   - Visit: `https://kdu-attendance-backend.onrender.com/api`
   - Should see: `{"message":"KDU Attendance Hub API","version":"1.0.0","status":"running"}`

---

## 🎨 Step 3: Deploy Frontend to Render

1. **Create New Static Site**
   - In Render Dashboard, click "New +" → "Static Site"
   - Select same GitHub repository

2. **Configure Frontend Service**
   - **Name**: `kdu-attendance-frontend`
   - **Region**: Singapore (same as backend)
   - **Branch**: `newBranch`
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. **Add Environment Variable**
   ```
   REACT_APP_API_URL=https://kdu-attendance-backend.onrender.com
   ```

4. **Create Static Site**
   - Click "Create Static Site"
   - Wait for build and deployment (~5-10 minutes)
   - Note your frontend URL: `https://kdu-attendance-frontend.onrender.com`

5. **Update Backend CORS**
   - Go back to backend service in Render
   - Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://kdu-attendance-frontend.onrender.com
   ```
   - Backend will auto-redeploy

---

## 🌐 Step 4: Set Up Custom Domain with Cloudflare

### Option A: Use Frontend URL for Custom Domain (Recommended)

1. **In Render (Frontend Service)**
   - Go to Settings → Custom Domain
   - Click "Add Custom Domain"
   - Enter your domain: `attendance.yourdomain.com`
   - Render will show you DNS records to add

2. **In Cloudflare Dashboard**
   - Log in to Cloudflare
   - Select your domain
   - Go to DNS → Records
   - Add CNAME record:
     ```
     Type: CNAME
     Name: attendance (or @ for root domain)
     Target: kdu-attendance-frontend.onrender.com
     Proxy status: Proxied (orange cloud)
     ```

3. **Update Backend FRONTEND_URL**
   - Go to backend service in Render
   - Update environment variable:
   ```
   FRONTEND_URL=https://attendance.yourdomain.com
   ```

4. **Wait for DNS Propagation** (5-30 minutes)
   - Test: `https://attendance.yourdomain.com`

### Option B: Use Cloudflare as Reverse Proxy (Advanced)

If you want both frontend and backend on same domain:

**Frontend**: `https://attendance.yourdomain.com`
**Backend**: `https://attendance.yourdomain.com/api`

1. **Set up Cloudflare Page Rules** (Requires paid plan)
   - Redirect `/api/*` to backend
   - Serve everything else from frontend

2. **Or use Cloudflare Workers** (Free tier available)
   - Create worker to route traffic
   - More complex but more flexible

---

## ✅ Step 5: Verify Deployment

1. **Check Backend**
   ```
   https://attendance.yourdomain.com (should show React app)
   https://kdu-attendance-backend.onrender.com/api (should show API response)
   ```

2. **Test Login**
   - Go to your custom domain
   - Try logging in with existing credentials
   - Check if attendance features work

3. **Monitor Services**
   - Render Dashboard shows logs, metrics
   - Check for any errors in "Logs" tab

---

## ⚙️ Step 6: Seed Database (First Time Only)

If your MongoDB is empty, seed it with initial data:

1. **Update Seed Script**
   - Make sure `backend/src/utils/seedDatabase.js` exists
   
2. **Run Seed via Render Shell**
   - In Render backend service → Shell tab
   - Run: `npm run seed`
   
3. **Or seed locally then upload to Atlas**
   - Update `backend/.env` with Atlas connection string
   - Run: `cd backend && npm run seed`

---

## 🔒 Security Checklist

- ✅ Strong JWT_SECRET (minimum 32 characters)
- ✅ MongoDB network access restricted (or use IP whitelist)
- ✅ CORS configured for your domain only
- ✅ HTTPS enabled (automatic on Render)
- ✅ Environment variables set (not in code)
- ✅ `.env` files in `.gitignore`

---

## 💰 Free Tier Limits

**Render Free Tier:**
- ✅ 750 hours/month per service (enough for 24/7 if one service)
- ✅ Automatic sleep after 15 min inactivity
- ✅ Cold start ~30 seconds
- ✅ 100GB bandwidth/month
- ⚠️ Backend sleeps when inactive (first request slower)

**MongoDB Atlas Free Tier (M0):**
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ No backup/restore
- ✅ Perfect for development/small apps

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Verify MongoDB connection string is correct
- Check MONGO_URI has database name

### Frontend can't connect to backend
- Check REACT_APP_API_URL is set correctly
- Verify CORS settings in backend
- Check browser console for errors
- Verify backend is running (visit backend URL)

### CORS errors
- Update FRONTEND_URL in backend environment variables
- Restart backend service
- Clear browser cache

### 404 errors on refresh
- `_redirects` file should be in `public/` folder
- Render should detect it automatically

### Cold start is slow
- Free tier limitation
- Consider upgrading to paid tier ($7/month) for always-on
- Or accept 30-second initial delay

---

## 📞 Support

If you encounter issues:
1. Check Render logs (most helpful!)
2. Check MongoDB Atlas metrics
3. Test backend API directly with Postman
4. Check browser console for frontend errors

---

## 🎉 Deployment Complete!

Your KDU MA Attendance Hub is now live:
- **Frontend**: https://attendance.yourdomain.com
- **Backend**: https://kdu-attendance-backend.onrender.com
- **Database**: MongoDB Atlas (Cloud)

Enjoy your fully deployed attendance management system! 🚀
