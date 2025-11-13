# Environment Variables Required for Deployment

## Backend Environment Variables (Vercel)

Add these in Vercel Dashboard → Backend Project → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_jwt_secret_key_here
FRONTEND_URL=https://admin.kduattendance.app
NODE_ENV=production
```

### Generate Secure JWT Secret

Run this in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Frontend Environment Variables (Vercel)

Add these in Vercel Dashboard → Frontend Project → Settings → Environment Variables:

```env
REACT_APP_API_URL=https://api-backend.kduattendance.app
```

**Note:** Replace `api-backend.kduattendance.app` with your chosen backend subdomain.

---

## MongoDB Atlas Setup (If you don't have a database yet)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a **FREE M0 cluster**
4. Create database user:
   - Username: `your_username`
   - Password: `your_secure_password`
5. Network Access:
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password

---

## CloudFlare DNS Records to Add

| Type | Name | Target | Proxy Status |
|------|------|--------|--------------|
| CNAME | `admin` | `cname.vercel-dns.com` | 🟠 Proxied |
| CNAME | `api-backend` | `cname.vercel-dns.com` | 🟠 Proxied |

---

## Deployment URLs

After deployment, you'll have:

| Service | URL |
|---------|-----|
| **Frontend (Custom)** | `https://admin.kduattendance.app` |
| **Backend (Custom)** | `https://api-backend.kduattendance.app` |
| Frontend (Vercel Default) | `https://kdu-attendance-frontend.vercel.app` |
| Backend (Vercel Default) | `https://kdu-attendance-backend.vercel.app` |

---

## Quick Deploy Checklist

### Before Deploying:
- [ ] MongoDB database ready
- [ ] JWT secret generated
- [ ] Code pushed to GitHub

### Backend Deployment:
- [ ] Create new Vercel project
- [ ] Set root directory to `backend`
- [ ] Add all 4 environment variables
- [ ] Deploy
- [ ] Add custom domain in Vercel
- [ ] Add CNAME record in CloudFlare
- [ ] Test API endpoint

### Frontend Deployment:
- [ ] Create new Vercel project
- [ ] Set root directory to `.` (root)
- [ ] Add `REACT_APP_API_URL` environment variable
- [ ] Deploy
- [ ] Add custom domain in Vercel
- [ ] Add CNAME record in CloudFlare
- [ ] Test website

### Final Steps:
- [ ] CloudFlare SSL/TLS set to "Full (strict)"
- [ ] Test login functionality
- [ ] Verify API calls work
- [ ] Check auto-deploy works (push a commit)

---

**Total Time:** ~30 minutes
**Total Cost:** $0

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed step-by-step instructions.
