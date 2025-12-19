# 🚀 Deployment Checklist - Fresh Meat Hub

Use this checklist to ensure smooth deployment to Render.

## Pre-Deployment

### MongoDB Atlas Setup
- [ ] Created MongoDB Atlas account
- [ ] Created a new cluster (M0 Free tier)
- [ ] Created database user with username and strong password
- [ ] Noted down the username: `______________`
- [ ] Noted down the password: `______________`
- [ ] Set IP whitelist to `0.0.0.0/0` (allow from anywhere)
- [ ] Got connection string from MongoDB Atlas
- [ ] Replaced `<password>` in connection string
- [ ] Added `/meat_shop` after `.net` in connection string
- [ ] Final connection string ready: ✅

**Your MongoDB Connection String:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/meat_shop?retryWrites=true&w=majority
```

### GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] `.gitignore` includes `node_modules/`, `.env`, `logs/`
- [ ] Both `backend/` and `frontend/` directories exist
- [ ] Repository URL: `______________`

## Backend Deployment

### Render Web Service Configuration
- [ ] Logged into Render (https://dashboard.render.com)
- [ ] Clicked "New +" → "Web Service"
- [ ] Connected GitHub repository
- [ ] Configured service:
  - [ ] Name: `fresh-meat-hub-backend`
  - [ ] Branch: `main`
  - [ ] Root Directory: `backend`
  - [ ] Runtime: `Node`
  - [ ] Build Command: `yarn install`
  - [ ] Start Command: `node server.js`
  - [ ] Instance: Free (or Starter $7/mo)

### Backend Environment Variables
Set these in Render dashboard (Environment tab):

- [ ] `MONGO_URL` = Your MongoDB Atlas connection string
- [ ] `DB_NAME` = `meat_shop`
- [ ] `CORS_ORIGINS` = `*` (change after frontend deployment)
- [ ] `ADMIN_PIN` = `4242` (or your custom PIN)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `8001`

### Backend Verification
- [ ] Service deployed successfully
- [ ] Noted backend URL: `______________`
- [ ] Tested: `https://YOUR-BACKEND-URL.onrender.com/api/`
- [ ] Response: `{"message":"Fresh Meat Hub API - Welcome!"}` ✅
- [ ] Tested stats: `https://YOUR-BACKEND-URL.onrender.com/api/stats`
- [ ] Tested products: `https://YOUR-BACKEND-URL.onrender.com/api/products`

## Frontend Deployment

### Update Frontend Configuration
- [ ] Updated `/frontend/.env` with backend URL:
  ```
  REACT_APP_BACKEND_URL=https://YOUR-BACKEND-URL.onrender.com
  ```
- [ ] Committed and pushed changes to GitHub

### Render Static Site Configuration
- [ ] Clicked "New +" → "Static Site"
- [ ] Connected same GitHub repository
- [ ] Configured:
  - [ ] Name: `fresh-meat-hub-frontend`
  - [ ] Branch: `main`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `yarn install && yarn build`
  - [ ] Publish Directory: `build`

### Frontend Environment Variables
- [ ] `REACT_APP_BACKEND_URL` = `https://YOUR-BACKEND-URL.onrender.com`

### Frontend Verification
- [ ] Site deployed successfully
- [ ] Noted frontend URL: `______________`
- [ ] Visited frontend URL in browser
- [ ] Homepage loads correctly ✅
- [ ] Products page loads ✅
- [ ] Cart functionality works ✅
- [ ] No console errors in DevTools ✅

## Update CORS Configuration

### Backend CORS Update
- [ ] Went to Render → Backend Service → Environment
- [ ] Updated `CORS_ORIGINS` from `*` to frontend URL
  ```
  CORS_ORIGINS=https://YOUR-FRONTEND-URL.onrender.com
  ```
- [ ] Saved (service will auto-redeploy)
- [ ] Waited for redeployment
- [ ] Tested frontend → backend communication ✅

## Final Testing

### Customer Flow
- [ ] Browse products by category
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Enter delivery details
- [ ] Check pincode (use: 500001, 500002, 500003, or 500004)
- [ ] Place order successfully
- [ ] Order confirmation shown

### Admin Flow
- [ ] Access admin section
- [ ] Login with PIN (default: 4242)
- [ ] View dashboard statistics
- [ ] View all orders
- [ ] Update order status (PENDING → PACKED → OUT FOR DELIVERY → COMPLETED)
- [ ] Add new product
- [ ] Upload product image
- [ ] Edit existing product
- [ ] Delete product
- [ ] Logout

### Backend Testing (via curl or Postman)
```bash
# Test API
curl https://YOUR-BACKEND-URL.onrender.com/api/

# Test stats
curl https://YOUR-BACKEND-URL.onrender.com/api/stats

# Test products
curl https://YOUR-BACKEND-URL.onrender.com/api/products

# Test pincode
curl -X POST https://YOUR-BACKEND-URL.onrender.com/api/check-pincode \
  -H "Content-Type: application/json" \
  -d '{"pincode":"500001"}'
```

- [ ] All API endpoints responding correctly ✅

## Post-Deployment

### Monitoring Setup
- [ ] Enabled email notifications in Render
- [ ] Bookmarked Render dashboard
- [ ] Bookmarked MongoDB Atlas dashboard
- [ ] Set up log monitoring

### Documentation
- [ ] Noted all URLs in a secure location:
  - Backend: `______________`
  - Frontend: `______________`
  - MongoDB: `______________`
- [ ] Noted admin credentials:
  - Admin PIN: `______________`
  - MongoDB User: `______________`
  - MongoDB Password: `______________`

### Security
- [ ] Changed default admin PIN from 4242
- [ ] Used strong MongoDB password (min 12 chars)
- [ ] Updated CORS to specific frontend URL (not *)
- [ ] Verified `.env` files not in GitHub
- [ ] Enabled MongoDB authentication

### Optional Enhancements
- [ ] Set up custom domain for backend
- [ ] Set up custom domain for frontend
- [ ] Upgraded to Render paid plan (for always-on service)
- [ ] Enabled MongoDB backups
- [ ] Added rate limiting to backend
- [ ] Set up analytics
- [ ] Added error tracking (e.g., Sentry)

## URLs Reference

Keep these URLs handy:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://__________________ | ☐ Live |
| **Backend** | https://__________________ | ☐ Live |
| **MongoDB Atlas** | https://cloud.mongodb.com | ☐ Connected |
| **Render Dashboard** | https://dashboard.render.com | ☐ Monitoring |

## Support Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Express.js Docs**: https://expressjs.com
- **React Docs**: https://react.dev

## Troubleshooting

If something isn't working:

1. **Check Render logs** (Dashboard → Service → Logs)
2. **Check MongoDB connection** (Atlas → Database → Collections)
3. **Check browser console** (DevTools → Console)
4. **Verify environment variables** (Render → Environment tab)
5. **Check CORS settings** (Should match frontend URL)
6. **Test backend independently** (Use curl/Postman)
7. **Review deployment guide** (RENDER_DEPLOYMENT_GUIDE.md)

## 🎉 Deployment Complete!

- [ ] All checkboxes above are checked ✅
- [ ] Application is live and working
- [ ] URLs shared with team/users
- [ ] Monitoring set up
- [ ] Ready for production use!

**Congratulations! Your Fresh Meat Hub is now live! 🚀**

---

**Notes:**
- Free tier services sleep after 15 mins of inactivity (first request may be slow)
- Keep MongoDB connection string and passwords secure
- Regular backups are recommended for production
- Monitor logs regularly for errors
- Consider upgrading to paid plans for production use
