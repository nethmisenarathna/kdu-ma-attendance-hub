# Vercel Deployment Guide

## 🚀 Complete Deployment Guide for Vercel + Custom Domain

This guide will walk you through deploying both **frontend** and **backend** to Vercel and connecting them to your custom subdomain `admin.kduattendance.app`.

---

## 📋 Prerequisites Checklist

- ✅ Domain: `kduattendance.app` (Name.com)
- ✅ DNS: CloudFlare (free plan)
- ✅ GitHub account with repository
- ✅ MongoDB database (MongoDB Atlas recommended for production)
- ✅ Code pushed to GitHub

---

## Part 1: Prepare Your Environment Variables

### 1.1 Backend Environment Variables

You'll need these for your backend deployment on Vercel:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_jwt_secret_key_here
FRONTEND_URL=https://admin.kduattendance.app
NODE_ENV=production
```

**How to generate a secure JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 1.2 Frontend Environment Variables

```env
REACT_APP_API_URL=https://api-backend.kduattendance.app
```

**Note:** Replace `api-backend.kduattendance.app` with whatever subdomain you choose for your backend.

---

## Part 2: Deploy Backend to Vercel

### Step 1: Sign Up / Log In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

### Step 2: Import Backend Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your repository: `KaveeshaSamarathunga/kdu-ma-attendance-hub`
3. Click **"Import"**
4. **Configure Project:**
   - **Project Name:** `kdu-attendance-backend` (or your choice)
   - **Framework Preset:** Other
   - **Root Directory:** Click **"Edit"** and select `backend`
   - **Build Command:** Leave empty (serverless function)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

### Step 3: Add Environment Variables

**IMPORTANT:** Before deploying, add your environment variables:

1. Expand **"Environment Variables"** section
2. Add each variable:
   - **Key:** `MONGODB_URI`, **Value:** Your MongoDB connection string
   - **Key:** `JWT_SECRET`, **Value:** Your generated secret
   - **Key:** `FRONTEND_URL`, **Value:** `https://admin.kduattendance.app`
   - **Key:** `NODE_ENV`, **Value:** `production`

3. Click **"Deploy"**

### Step 4: Wait for Deployment

⏱️ Wait 2-5 minutes. You'll get a URL like:
```
https://kdu-attendance-backend.vercel.app
```

**Test it:** Visit `https://kdu-attendance-backend.vercel.app/` - you should see:
```json
{
  "message": "KDU Attendance Hub API",
  "version": "1.0.0"
}
```

---

## Part 3: Add Custom Domain to Backend

### Step 1: Add Domain in Vercel

1. Go to your backend project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter: `api-backend.kduattendance.app` (or your chosen subdomain)
4. Click **"Add"**

Vercel will show:
```
Type: CNAME
Name: api-backend
Value: cname.vercel-dns.com
```

### Step 2: Add DNS Record in CloudFlare

1. Log in to [CloudFlare Dashboard](https://dash.cloudflare.com)
2. Select domain: `kduattendance.app`
3. Go to **"DNS"** → **"Records"**
4. Click **"Add record"**

**Enter:**
- **Type:** `CNAME`
- **Name:** `api-backend`
- **Target:** `cname.vercel-dns.com`
- **Proxy status:** 🟠 **Proxied** (Orange cloud)
- **TTL:** Auto

5. Click **"Save"**

### Step 3: Verify Domain

1. Go back to Vercel → Project → **Settings** → **Domains**
2. Wait 1-5 minutes
3. You'll see ✅ **Valid Configuration**
4. HTTPS will be automatically enabled

**Test:** Visit `https://api-backend.kduattendance.app/` - should work!

---

## Part 4: Deploy Frontend to Vercel

### Step 1: Import Frontend Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Select your repository again: `KaveeshaSamarathunga/kdu-ma-attendance-hub`
3. Click **"Import"**
4. **Configure Project:**
   - **Project Name:** `kdu-attendance-frontend`
   - **Framework Preset:** Create React App
   - **Root Directory:** `.` (root, NOT frontend folder)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install`

### Step 2: Add Environment Variables

1. Expand **"Environment Variables"**
2. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://api-backend.kduattendance.app` (your backend URL)

3. Click **"Deploy"**

### Step 3: Wait for Deployment

⏱️ Wait 2-5 minutes. You'll get:
```
https://kdu-attendance-frontend.vercel.app
```

**Test it:** Visit the URL - your app should load!

---

## Part 5: Add Custom Domain to Frontend

### Step 1: Add Domain in Vercel

1. Go to your frontend project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter: `admin.kduattendance.app`
4. Click **"Add"**

### Step 2: Add DNS Record in CloudFlare

1. Go to CloudFlare Dashboard
2. DNS → Records
3. Click **"Add record"**

**Enter:**
- **Type:** `CNAME`
- **Name:** `admin`
- **Target:** `cname.vercel-dns.com`
- **Proxy status:** 🟠 **Proxied**
- **TTL:** Auto

4. Click **"Save"**

### Step 3: Verify Domain

Wait 1-5 minutes, then check Vercel dashboard. You'll see ✅ when ready.

**Test:** Visit `https://admin.kduattendance.app` - your app should work!

---

## Part 6: Enable Auto-Deploy

Vercel automatically deploys on every push to your default branch.

**Test Auto-Deploy:**

```powershell
# Make a small change
echo "# Deployed to Vercel" >> README.md

# Commit and push
git add .
git commit -m "Test auto-deploy"
git push
```

Go to Vercel dashboard → **Deployments** - you'll see a new deployment automatically trigger!

---

## Part 7: Update CloudFlare SSL Settings

To avoid redirect issues:

1. Go to CloudFlare Dashboard
2. Select `kduattendance.app`
3. **SSL/TLS** → **Overview**
4. Set to: **"Full (strict)"**

---

## Part 8: Testing Checklist

### Backend Tests

```powershell
# Test API root
curl https://api-backend.kduattendance.app/

# Test a specific endpoint
curl https://api-backend.kduattendance.app/api/students
```

### Frontend Tests

1. Visit `https://admin.kduattendance.app`
2. Check login functionality
3. Verify API calls work (check browser console - F12)
4. Test all major features

### DNS Propagation Check

```powershell
nslookup admin.kduattendance.app
nslookup api-backend.kduattendance.app
```

---

## 🔧 Troubleshooting

### Issue: "Not allowed by CORS"

**Solution:** Update `FRONTEND_URL` in backend environment variables:
1. Vercel → Backend Project → **Settings** → **Environment Variables**
2. Edit `FRONTEND_URL` to match your exact frontend URL
3. Redeploy: **Deployments** → Click "..." → **Redeploy**

### Issue: "Failed to connect to database"

**Solution:** Check MongoDB Atlas:
1. Database Access: Ensure user exists with correct password
2. Network Access: Add `0.0.0.0/0` to IP whitelist (allow all)
3. Check `MONGODB_URI` format is correct

### Issue: "502 Bad Gateway" on Backend

**Solution:** Check Vercel logs:
1. Go to backend project → **Deployments**
2. Click latest deployment → **View Function Logs**
3. Look for errors

### Issue: Environment Variables Not Working

**Solution:**
1. Vercel → Project → **Settings** → **Environment Variables**
2. Make sure variables are set for **Production** environment
3. After adding/editing, go to **Deployments** tab
4. Click "..." on latest → **Redeploy**

### Issue: "Too Many Redirects"

**Solution:**
- CloudFlare: SSL/TLS → Set to **"Full (strict)"**
- Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Quick Reference

### Your URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://admin.kduattendance.app` |
| Backend | `https://api-backend.kduattendance.app` |
| Frontend (Vercel) | `https://kdu-attendance-frontend.vercel.app` |
| Backend (Vercel) | `https://kdu-attendance-backend.vercel.app` |

### Environment Variables Summary

**Backend (Vercel):**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secure random string
- `FRONTEND_URL` - `https://admin.kduattendance.app`
- `NODE_ENV` - `production`

**Frontend (Vercel):**
- `REACT_APP_API_URL` - `https://api-backend.kduattendance.app`

---

## 💰 Cost Breakdown

- **Vercel Hobby Plan:** $0/month
  - ✅ Unlimited deployments
  - ✅ Automatic HTTPS
  - ✅ 100GB bandwidth
  - ✅ Serverless functions
  - ✅ Custom domains

- **CloudFlare Free Plan:** $0/month
  - ✅ DNS management
  - ✅ DDoS protection
  - ✅ SSL certificates
  - ✅ CDN

- **MongoDB Atlas Free Tier:** $0/month
  - ✅ 512MB storage
  - ✅ Shared cluster

**Total Cost: $0** ✅

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring:** Use Vercel Analytics (free)
2. **Add custom error pages:** Create `404.html`, `500.html`
3. **Configure preview deployments:** Vercel automatically creates previews for PRs
4. **Set up production branch:** Use `main` or `production` branch
5. **Add status badge:** Show deployment status in README

---

## 📝 Important Notes

- **Existing subdomain is safe:** Your `api.kduattendance.app` AWS setup won't be affected
- **DNS propagation:** Usually 5-30 minutes, max 48 hours
- **HTTPS is automatic:** Vercel handles SSL certificates
- **Serverless:** Backend runs as serverless functions (no 24/7 server needed)
- **Git-based:** Every push deploys automatically
- **Rollback:** Can rollback to any previous deployment in Vercel dashboard

---

## 🆘 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **CloudFlare Docs:** [developers.cloudflare.com](https://developers.cloudflare.com)
- **Check deployment logs:** Vercel Dashboard → Project → Deployments → Function Logs

---

**Ready to deploy?** Follow the steps above in order! 🚀
