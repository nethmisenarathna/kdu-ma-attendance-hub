# 🚀 Quick Deployment Reference

## URLs After Deployment

### Development (Local)
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production (Render)
- Frontend: https://kdu-attendance-frontend.onrender.com
- Backend: https://kdu-attendance-backend.onrender.com
- Custom Domain: https://attendance.yourdomain.com

---

## Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/kdu-attendance
JWT_SECRET=your_32_char_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=https://attendance.yourdomain.com
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://kdu-attendance-backend.onrender.com
```

---

## DNS Configuration (Cloudflare)

### For Custom Domain

**Type**: CNAME  
**Name**: attendance (or @ for root)  
**Target**: kdu-attendance-frontend.onrender.com  
**Proxy**: Enabled (Orange cloud)  
**TTL**: Auto

---

## Deployment Commands

### Local Development
```bash
# Frontend
npm start

# Backend
cd backend
npm run dev
```

### Production Build (Test locally)
```bash
# Frontend
npm run build
npx serve -s build

# Backend
cd backend
npm start
```

---

## MongoDB Atlas Connection

1. Get connection string from Atlas
2. Replace `<password>` with actual password
3. Add database name: `/kdu-attendance`
4. Example:
```
mongodb+srv://kdu-admin:MyP@ssw0rd@cluster0.abc123.mongodb.net/kdu-attendance?retryWrites=true&w=majority
```

---

## Render Service Settings

### Backend Service
- **Name**: kdu-attendance-backend
- **Root Directory**: backend
- **Build**: `npm install`
- **Start**: `npm start`
- **Plan**: Free
- **Auto-Deploy**: Yes

### Frontend Service  
- **Name**: kdu-attendance-frontend
- **Root Directory**: (empty)
- **Build**: `npm install && npm run build`
- **Publish**: build
- **Plan**: Free
- **Auto-Deploy**: Yes

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Backend sleeping | Free tier - wait 30s on first request |
| CORS error | Update FRONTEND_URL in backend env vars |
| 404 on refresh | `_redirects` file in public folder |
| MongoDB connection failed | Check connection string and IP whitelist |
| Build failed | Check logs in Render dashboard |

---

## Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudflare DNS**: https://dash.cloudflare.com
- **GitHub Repo**: https://github.com/KaveeshaSamarathunga/kdu-ma-attendance-hub

---

## Support Contacts

- Backend Issues: Check Render logs
- Frontend Issues: Check browser console  
- Database Issues: Check MongoDB Atlas metrics
- DNS Issues: Check Cloudflare DNS settings

---

**Last Updated**: November 12, 2025
