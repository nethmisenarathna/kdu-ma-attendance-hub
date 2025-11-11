# 🌐 Custom Domain Setup Guide

## Goal: Single Domain for Entire App

You want: `https://attendance.yourdomain.com` for everything

---

## 📍 Architecture Overview

```
Your Domain (Cloudflare)
         ↓
    [CNAME Record]
         ↓
Render Frontend (Static Site)
         ↓
    [Makes API calls to]
         ↓
Render Backend (Web Service)
```

**Why this works:**
- Frontend is served from your custom domain
- Backend stays on Render's URL (hidden from users)
- Frontend code internally calls backend API
- Users only see your custom domain

---

## 🎯 Step-by-Step Domain Setup

### Step 1: Deploy Both Services First

Complete these before adding custom domain:
1. ✅ Backend deployed to Render
2. ✅ Frontend deployed to Render
3. ✅ Both working on Render URLs
4. ✅ Backend and frontend can communicate

### Step 2: Add Custom Domain to Render Frontend

1. **Go to Render Dashboard**
   - Navigate to your **frontend** service (`kdu-attendance-frontend`)
   - Click on "Settings"

2. **Add Custom Domain**
   - Scroll to "Custom Domain" section
   - Click "Add Custom Domain"
   - Enter: `attendance.yourdomain.com` (or just `yourdomain.com`)
   - Click "Save"

3. **Note the DNS Instructions**
   - Render will show you:
     ```
     Add a CNAME record in your DNS:
     Name: attendance (or @)
     Value: kdu-attendance-frontend.onrender.com
     ```

### Step 3: Configure DNS in Cloudflare

1. **Log in to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com
   - Select your domain

2. **Add CNAME Record**
   - Go to "DNS" → "Records"
   - Click "Add record"
   
   **For subdomain (recommended):**
   ```
   Type: CNAME
   Name: attendance
   Target: kdu-attendance-frontend.onrender.com
   Proxy status: Proxied (🟠 orange cloud)
   TTL: Auto
   ```
   
   **For root domain (alternative):**
   ```
   Type: CNAME
   Name: @
   Target: kdu-attendance-frontend.onrender.com
   Proxy status: Proxied (🟠 orange cloud)
   TTL: Auto
   ```

3. **Save the Record**
   - Click "Save"
   - DNS changes may take 5-30 minutes to propagate

### Step 4: Update Backend CORS

1. **Go to Render Backend Service**
   - Navigate to `kdu-attendance-backend`
   - Go to "Environment"

2. **Update FRONTEND_URL**
   ```
   FRONTEND_URL=https://attendance.yourdomain.com
   ```
   (Or `https://yourdomain.com` if using root)

3. **Save and Redeploy**
   - Backend will automatically redeploy
   - Wait for deployment to complete

### Step 5: Verify Setup

1. **Check DNS Propagation**
   ```powershell
   nslookup attendance.yourdomain.com
   ```
   Should show Cloudflare IPs

2. **Test Custom Domain**
   - Visit: `https://attendance.yourdomain.com`
   - Should show your React app
   - SSL should work automatically (Cloudflare + Render)

3. **Test Login**
   - Try logging in
   - Check browser console (F12) for errors
   - Verify API calls work

---

## 🎨 What Users Will See

### ✅ What You Want (and will get):
- User visits: `https://attendance.yourdomain.com`
- User sees: Login page, dashboard, all pages
- URL never changes (stays on your domain)
- Backend API calls happen in background
- Professional, clean URL

### ❌ What Users Won't See:
- Render URLs (kdu-attendance-*.onrender.com)
- Backend URL in address bar
- Any confusing domain changes

---

## 🔍 How It Actually Works

1. **User visits**: `https://attendance.yourdomain.com`
   - Cloudflare receives request
   - Forwards to Render frontend
   - User sees React app

2. **User logs in**:
   - React app makes API call to: `https://kdu-attendance-backend.onrender.com/api/auth/login`
   - This happens in JavaScript (invisible to user)
   - User still sees: `https://attendance.yourdomain.com`

3. **All Pages**:
   - User navigates: Dashboard, Students, Lectures
   - URL shows: `https://attendance.yourdomain.com/dashboard`, etc.
   - API calls go to backend (background)
   - Everything appears seamless

---

## 🆚 Advanced Option: Backend Also on Custom Domain

If you want backend also accessible on your domain:
- Frontend: `https://attendance.yourdomain.com`
- Backend: `https://api.attendance.yourdomain.com`

### Setup:

1. **Add Second CNAME in Cloudflare**:
   ```
   Type: CNAME
   Name: api.attendance
   Target: kdu-attendance-backend.onrender.com
   Proxy: Enabled
   ```

2. **Add Custom Domain in Render Backend**:
   - Go to backend service → Settings → Custom Domain
   - Add: `api.attendance.yourdomain.com`

3. **Update Frontend Config**:
   ```javascript
   REACT_APP_API_URL=https://api.attendance.yourdomain.com
   ```

4. **Update Backend CORS**:
   ```
   FRONTEND_URL=https://attendance.yourdomain.com
   ```

**Result**: Both on your domain, but NOT NECESSARY for your use case!

---

## 🎯 Recommended Setup (Simplest)

### For Your Case:

**Frontend (visible)**: `https://attendance.yourdomain.com`  
**Backend (hidden)**: `https://kdu-attendance-backend.onrender.com`

This is:
- ✅ Simplest to set up
- ✅ Requires only ONE CNAME record
- ✅ Users only see your domain
- ✅ Backend URL never visible to users
- ✅ Professional appearance

### DNS Configuration (Only This Needed):

```
Cloudflare DNS Records:

┌──────────┬────────────────┬────────────────────────────────────────┬────────┐
│   Type   │      Name      │                Target                  │ Proxy  │
├──────────┼────────────────┼────────────────────────────────────────┼────────┤
│  CNAME   │  attendance    │  kdu-attendance-frontend.onrender.com  │  🟠 ON │
└──────────┴────────────────┴────────────────────────────────────────┴────────┘
```

**That's it!** One CNAME record, pointing to your frontend.

---

## ⏱️ Timeline

| Step | Time |
|------|------|
| Deploy backend to Render | 5-10 minutes |
| Deploy frontend to Render | 5-10 minutes |
| Add custom domain in Render | 1 minute |
| Add CNAME in Cloudflare | 1 minute |
| DNS propagation | 5-30 minutes |
| Update backend CORS | 2 minutes + redeploy |
| **Total** | **20-60 minutes** |

---

## 🔧 Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"
- DNS not propagated yet (wait 30 min)
- CNAME record incorrect (check spelling)
- Cloudflare proxy not enabled

### "This site can't provide a secure connection"
- SSL not ready yet (wait a few minutes)
- Custom domain not added in Render
- Cloudflare SSL mode should be "Full" or "Full (strict)"

### "CORS Error" in browser console
- FRONTEND_URL not updated in backend
- Backend not redeployed after env var change
- Check backend logs for actual frontend URL

### Login works but data doesn't load
- Backend API URL incorrect in frontend
- Check browser Network tab for failed requests
- Verify backend is running (visit backend URL directly)

---

## 📋 Quick Checklist

Before you start:
- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] Domain registered and in Cloudflare
- [ ] Cloudflare DNS management active

To complete setup:
- [ ] Add custom domain in Render (frontend)
- [ ] Add CNAME in Cloudflare
- [ ] Update FRONTEND_URL in backend
- [ ] Wait for DNS propagation
- [ ] Test custom domain
- [ ] Verify login works
- [ ] Confirm all features work

---

## 🎉 Final Result

After setup, users will experience:

1. Visit: `https://attendance.yourdomain.com`
2. See: Beautiful login page
3. Login: Works seamlessly
4. Navigate: All pages on your domain
5. Experience: Professional, polished app

**Backend URL never exposed. Everything appears on your custom domain.** ✨

---

## 💡 Pro Tip

Want to check if it's working before DNS propagates?

Edit your computer's hosts file:
```
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts

104.21.X.X  attendance.yourdomain.com
```
(Replace with Cloudflare IP from `nslookup kdu-attendance-frontend.onrender.com`)

This lets you test before DNS is live!

---

**Questions?** Check DEPLOYMENT.md for full detailed guide!
