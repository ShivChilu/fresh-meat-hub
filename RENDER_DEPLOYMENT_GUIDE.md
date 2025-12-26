# 🚀 Render Deployment Guide - Fresh Meat Hub (MERN Stack)

## Overview
This guide will walk you through deploying your Fresh Meat Hub MERN application on Render. You'll deploy:
1. **Backend** (Express.js + Node.js) as a Web Service
2. **Frontend** (React) as a Static Site
3. **MongoDB** via MongoDB Atlas (free tier)

---

## 📋 Prerequisites

- GitHub account
- Render account (free tier available at https://render.com)
- MongoDB Atlas account (free tier at https://mongodb.com/cloud/atlas)

---

## Part 1: Setup MongoDB Atlas

### Step 1: Create MongoDB Cluster

1. Go to https://mongodb.com/cloud/atlas and sign in
2. Click **"Build a Database"**
3. Choose **"M0 Free"** tier
4. Select a cloud provider and region (choose closest to your users)
5. Name your cluster (e.g., `fresh-meat-hub`)
6. Click **"Create Cluster"**

### Step 2: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `meatshop_user` (or your choice)
5. Password: Generate a strong password (save it securely!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, you should whitelist Render's IPs instead
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://meatshop_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add database name after `.net/`: `meat_shop`
   ```
   mongodb+srv://meatshop_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/meat_shop?retryWrites=true&w=majority
   ```
7. **Save this connection string** - you'll need it for Render!

---

## Part 2: Prepare Your Repository

### Step 1: Push to GitHub

If not already done:

```bash
git init
git add .
git commit -m "MERN stack ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fresh-meat-hub.git
git push -u origin main
```

### Step 2: Add .gitignore

Ensure your `.gitignore` includes:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production.local

# Logs
logs/
*.log

# Build
build/
dist/

# Misc
.DS_Store
```

---

## Part 3: Deploy Backend to Render

### Step 1: Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `fresh-meat-hub-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `yarn install`
- **Start Command**: `node server.js`

**Instance Type:**
- Select **"Free"** (or paid plan for better performance)

### Step 2: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `MONGO_URL` | Your MongoDB Atlas connection string (from Part 1, Step 4) |
| `DB_NAME` | `meat_shop` |
| `CORS_ORIGINS` | `*` (or your frontend URL after deployment) |
| `ADMIN_PIN` | `4242` (or your custom PIN) |
| `NODE_ENV` | `production` |
| `PORT` | `8001` |

**Example:**
```
MONGO_URL=mongodb+srv://meatshop_user:MyPassword123@cluster0.xxxxx.mongodb.net/meat_shop?retryWrites=true&w=majority
DB_NAME=meat_shop
CORS_ORIGINS=*
ADMIN_PIN=4242
NODE_ENV=production
PORT=8001
```

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://fresh-meat-hub-backend.onrender.com`
4. Test it: `https://fresh-meat-hub-backend.onrender.com/api/`
   - Should return: `{"message":"Fresh Meat Hub API - Welcome!"}`

---

## Part 4: Deploy Frontend to Render

### Step 1: Update Frontend Environment

Before deploying, update `/app/frontend/.env`:

```env
REACT_APP_BACKEND_URL=https://fresh-meat-hub-backend.onrender.com
```

Commit and push:
```bash
git add frontend/.env
git commit -m "Update backend URL for production"
git push
```

### Step 2: Create Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:

**Basic Settings:**
- **Name**: `fresh-meat-hub-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `yarn install && yarn build`
- **Publish Directory**: `build`

### Step 3: Environment Variables (Build Time)

Add these environment variables:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://fresh-meat-hub-backend.onrender.com` |

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Wait for build and deployment
3. You'll get a URL like: `https://fresh-meat-hub-frontend.onrender.com`

---

## Part 5: Update CORS Configuration

### Step 1: Update Backend CORS

Now that you have your frontend URL, update backend CORS:

1. Go to Render Dashboard → Your backend service
2. **Environment** → Edit `CORS_ORIGINS`
3. Change from `*` to your frontend URL:
   ```
   CORS_ORIGINS=https://fresh-meat-hub-frontend.onrender.com
   ```
4. Save → Service will auto-redeploy

---

## Part 6: Testing Your Deployment

### Backend Tests

```bash
# Root endpoint
curl https://fresh-meat-hub-backend.onrender.com/api/

# Stats
curl https://fresh-meat-hub-backend.onrender.com/api/stats

# Products
curl https://fresh-meat-hub-backend.onrender.com/api/products
```

### Frontend Test

1. Visit: `https://fresh-meat-hub-frontend.onrender.com`
2. Test features:
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Check pincode
   - ✅ Admin login (PIN: 4242)
   - ✅ Create product (Admin)
   - ✅ Place order

---

## 🔧 Configuration Files for Render

### Optional: render.yaml (Infrastructure as Code)

Create `/render.yaml` in project root for automated deployment:

```yaml
services:
  # Backend
  - type: web
    name: fresh-meat-hub-backend
    runtime: node
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && yarn install
    startCommand: cd backend && node server.js
    envVars:
      - key: MONGO_URL
        sync: false
      - key: DB_NAME
        value: meat_shop
      - key: CORS_ORIGINS
        sync: false
      - key: ADMIN_PIN
        sync: false
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8001

  # Frontend
  - type: web
    name: fresh-meat-hub-frontend
    runtime: static
    buildCommand: cd frontend && yarn install && yarn build
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_BACKEND_URL
        sync: false
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend Not Starting

**Error**: `Application failed to respond`

**Solutions**:
1. Check logs in Render Dashboard → Backend Service → Logs
2. Verify `PORT` environment variable is set to `8001`
3. Ensure `server.js` listens on `process.env.PORT || 8001`
4. Check MongoDB connection string is correct

### Issue 2: MongoDB Connection Failed

**Error**: `MongoServerError: Authentication failed`

**Solutions**:
1. Verify MongoDB Atlas username/password
2. Check IP whitelist (allow 0.0.0.0/0)
3. Ensure connection string includes database name
4. Test connection string locally first

### Issue 3: CORS Errors

**Error**: `Access-Control-Allow-Origin` blocked

**Solutions**:
1. Update `CORS_ORIGINS` in backend environment variables
2. Include your frontend URL (no trailing slash)
3. For development: use `*`
4. For production: use specific frontend URL

### Issue 4: Frontend Can't Reach Backend

**Error**: `Network Error` or `ERR_CONNECTION_REFUSED`

**Solutions**:
1. Check `REACT_APP_BACKEND_URL` is correct
2. Rebuild frontend after changing env vars
3. Ensure backend URL includes `/api` in frontend code
4. Verify backend is actually running

### Issue 5: Free Tier Sleep

**Issue**: Render free tier sleeps after 15 mins inactivity

**Solutions**:
1. First request will be slow (cold start ~30 seconds)
2. Use paid plan for always-on service
3. Use a service like UptimeRobot to ping every 14 mins
4. Inform users about potential initial delay

### Issue 6: Build Failures

**Error**: `Build failed` or `Module not found`

**Solutions**:
1. Check `package.json` has all dependencies
2. Verify `yarn.lock` is committed
3. Clear Render build cache (Settings → Clear build cache)
4. Check Node version compatibility

---

## 📊 Post-Deployment Monitoring

### Check Service Health

**Backend:**
```bash
curl https://your-backend.onrender.com/api/stats
```

**Frontend:**
Visit in browser and open DevTools → Network tab

### View Logs

1. Render Dashboard → Your Service
2. Click **"Logs"** tab
3. Monitor for errors in real-time

### Set Up Alerts

1. Go to Service Settings → Notifications
2. Add email/Slack for deploy notifications
3. Monitor deploy failures

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use strong MongoDB passwords
- ✅ Change default admin PIN
- ✅ Rotate credentials regularly

### 2. CORS Configuration
- ✅ Use specific origins in production (not `*`)
- ✅ Whitelist only your frontend domain

### 3. MongoDB Atlas
- ✅ Enable IP whitelist (specific IPs for production)
- ✅ Use separate database users for dev/prod
- ✅ Enable MongoDB authentication
- ✅ Regular backups

### 4. Rate Limiting (Recommended)
Add to `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

Install: `yarn add express-rate-limit`

---

## 💰 Cost Estimation

### Free Tier (Render + MongoDB Atlas)
- **Backend**: Free (750 hrs/month)
- **Frontend**: Free (100 GB bandwidth)
- **Database**: Free (512 MB storage)
- **Total**: $0/month

**Limitations:**
- Services sleep after 15 mins inactivity
- Limited resources
- Slower cold starts

### Paid Plan (Recommended for Production)
- **Backend**: $7/month (Starter)
- **Frontend**: Free
- **Database**: Free (or $9/month for 2GB)
- **Total**: ~$7-16/month

---

## 🎉 Deployment Checklist

Before going live:

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured with strong password
- [ ] IP whitelist configured (0.0.0.0/0 or Render IPs)
- [ ] Backend deployed on Render
- [ ] Environment variables set (MONGO_URL, DB_NAME, CORS_ORIGINS, ADMIN_PIN)
- [ ] Backend API tested (curl tests pass)
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend deployed on Render
- [ ] CORS updated with specific frontend URL
- [ ] Frontend tested in browser
- [ ] Admin login tested
- [ ] Order creation tested
- [ ] Product management tested
- [ ] Logs monitored for errors
- [ ] Custom domain configured (optional)

---

## 🌐 Optional: Custom Domain

### For Backend

1. Render Dashboard → Backend Service → Settings
2. Scroll to **Custom Domain**
3. Add your domain: `api.yourdomain.com`
4. Update DNS records as instructed
5. Update frontend `REACT_APP_BACKEND_URL`

### For Frontend

1. Render Dashboard → Frontend Site → Settings
2. Scroll to **Custom Domain**
3. Add your domain: `yourdomain.com`
4. Update DNS records (A or CNAME)
5. Update backend `CORS_ORIGINS`

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express.js Docs**: https://expressjs.com
- **React Deployment**: https://create-react-app.dev/docs/deployment

---

## 🔄 Continuous Deployment

Render auto-deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render automatically:
# 1. Detects the push
# 2. Runs build
# 3. Deploys if successful
# 4. Sends notification
```

---

## ✅ You're All Set!

Your Fresh Meat Hub MERN application is now live on Render! 🎉

**Next Steps:**
1. Share your frontend URL with users
2. Monitor logs for issues
3. Add more features
4. Consider upgrading to paid plan for production
5. Set up backups for MongoDB

Good luck with your deployment! 🚀
