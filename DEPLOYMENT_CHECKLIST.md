# ✅ Production Deployment Checklist

Use this checklist to ensure your deployment is complete and correct.

---

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to GitHub
- [ ] Branch pushed to repository (`newBranch` or main)
- [ ] `.env` files are in `.gitignore` (not committed)
- [ ] `render.yaml` is in root directory
- [ ] `_redirects` file is in `public/` directory
- [ ] All service files updated to use `config.js`
- [ ] Backend CORS configuration uses `FRONTEND_URL`

### Database Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created (Free M0 tier)
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string obtained
- [ ] Database name added to connection string (`/kdu-attendance`)

### Render Account
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Repository accessible in Render

---

## 🚀 Deployment Checklist

### Backend Deployment
- [ ] Web Service created in Render
- [ ] Service name: `kdu-attendance-backend`
- [ ] Root directory set to: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Region selected (Singapore recommended)
- [ ] Free plan selected

### Backend Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `MONGO_URI` set with Atlas connection string
- [ ] `JWT_SECRET` generated (32+ characters)
- [ ] `JWT_EXPIRE=7d`
- [ ] `COOKIE_EXPIRE=7`
- [ ] `FRONTEND_URL` set (update after frontend deployed)

### Backend Verification
- [ ] Service deployed successfully (green status)
- [ ] No errors in logs
- [ ] Backend URL accessible: `https://kdu-attendance-backend.onrender.com`
- [ ] Health check working: Visit `/api` endpoint
- [ ] Response shows: `{"message":"KDU Attendance Hub API"...}`

### Frontend Deployment
- [ ] Static Site created in Render
- [ ] Service name: `kdu-attendance-frontend`
- [ ] Root directory: (empty/root)
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `build`
- [ ] Region: Same as backend
- [ ] Free plan selected

### Frontend Environment Variables
- [ ] `REACT_APP_API_URL` set to backend URL

### Frontend Verification
- [ ] Build completed successfully
- [ ] No errors in build logs
- [ ] Frontend URL accessible: `https://kdu-attendance-frontend.onrender.com`
- [ ] Login page loads correctly
- [ ] Images and styles load properly

---

## 🌐 Custom Domain Setup (Optional)

### Cloudflare Configuration
- [ ] Domain added to Cloudflare
- [ ] DNS management transferred to Cloudflare
- [ ] CNAME record created
  - Type: `CNAME`
  - Name: `attendance` (or `@`)
  - Target: `kdu-attendance-frontend.onrender.com`
  - Proxy: Enabled (orange cloud)

### Render Custom Domain
- [ ] Custom domain added in Render frontend settings
- [ ] Domain: `attendance.yourdomain.com`
- [ ] SSL certificate generated (automatic)
- [ ] DNS propagation complete (test with: `nslookup attendance.yourdomain.com`)

### Backend CORS Update
- [ ] `FRONTEND_URL` updated to custom domain
- [ ] Backend redeployed with new URL
- [ ] CORS working (no errors in browser console)

---

## 🔒 Security Checklist

- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] MongoDB user has strong password
- [ ] Environment variables not in code
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS restricted to your domain only
- [ ] MongoDB network access configured properly

---

## ✅ Final Testing Checklist

### Functionality Tests
- [ ] Login works with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Dashboard loads with data
- [ ] Students page displays correctly
- [ ] Lecturers page displays correctly
- [ ] Lectures page displays correctly
- [ ] Attendance sheet loads
- [ ] Attendance can be marked
- [ ] Reports can be generated
- [ ] Excel export works
- [ ] Notifications display correctly
- [ ] Profile page loads
- [ ] Logout works correctly

### Browser Tests
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive design works

### Performance Tests
- [ ] Initial load < 5 seconds (after cold start)
- [ ] Subsequent loads < 2 seconds
- [ ] API responses < 1 second
- [ ] No console errors
- [ ] No network errors

### Data Tests
- [ ] Database has seed data (or real data)
- [ ] Students load correctly
- [ ] Lecturers load correctly
- [ ] Lectures load correctly
- [ ] Attendance records display
- [ ] Reports generate correctly

---

## 📊 Post-Deployment Monitoring

### Daily Checks (First Week)
- [ ] Check Render logs for errors
- [ ] Monitor MongoDB Atlas usage
- [ ] Check application uptime
- [ ] Test critical user flows

### Weekly Checks
- [ ] Review Render bandwidth usage
- [ ] Check MongoDB storage usage
- [ ] Monitor cold start times
- [ ] Review error logs

### Monthly Checks
- [ ] Verify SSL certificate valid
- [ ] Check for dependency updates
- [ ] Review security advisories
- [ ] Backup critical data

---

## 🐛 Troubleshooting Reference

| Issue | Check | Solution |
|-------|-------|----------|
| Backend not starting | Render logs | Verify env vars, MongoDB connection |
| Frontend blank page | Browser console | Check API URL, CORS settings |
| CORS errors | Network tab | Update FRONTEND_URL in backend |
| 404 on refresh | Build logs | Verify `_redirects` file exists |
| Login not working | Backend logs | Check JWT_SECRET, database connection |
| Slow cold start | - | Expected on free tier (~30s) |
| MongoDB connection failed | Atlas dashboard | Check IP whitelist, credentials |

---

## 📝 Important URLs to Save

```
# Backend
Production: https://kdu-attendance-backend.onrender.com
Health Check: https://kdu-attendance-backend.onrender.com/api

# Frontend  
Production: https://kdu-attendance-frontend.onrender.com
Custom Domain: https://attendance.yourdomain.com

# Dashboards
Render: https://dashboard.render.com
MongoDB: https://cloud.mongodb.com
Cloudflare: https://dash.cloudflare.com
GitHub: https://github.com/KaveeshaSamarathunga/kdu-ma-attendance-hub
```

---

## 🎉 Deployment Complete!

Once all items are checked:
1. ✅ Your app is live and accessible
2. ✅ Database is connected and working
3. ✅ Custom domain configured (if applicable)
4. ✅ All features tested and working
5. ✅ Monitoring in place

**Congratulations! Your KDU MA Attendance Hub is now in production!** 🚀

---

**Date Completed**: _______________  
**Deployed By**: _______________  
**Production URL**: _______________
