# ⚡ Quick Start Guide - Fresh Meat Hub

Get your MERN stack application running in 5 minutes!

## 🏠 Local Development

### Prerequisites
- Node.js v18+ installed
- MongoDB running locally (or MongoDB Atlas account)
- Git installed

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd fresh-meat-hub

# Install backend dependencies
cd backend
yarn install

# Install frontend dependencies
cd ../frontend
yarn install
```

### Step 2: Configure Environment

**Backend** (`/backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=meat_shop
CORS_ORIGINS=*
ADMIN_PIN=4242
NODE_ENV=development
PORT=8001
```

**Frontend** (`/frontend/.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas**
- Use your connection string in `MONGO_URL`

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
yarn start
# Server running on http://localhost:8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
# Frontend running on http://localhost:3000
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/
- **Admin PIN**: 4242

## ✅ Verify Installation

Test backend:
```bash
curl http://localhost:8001/api/
# Should return: {"message":"Fresh Meat Hub API - Welcome!"}

curl http://localhost:8001/api/stats
# Should return stats object
```

Test frontend:
- Open http://localhost:3000 in browser
- Browse products
- Try admin login (PIN: 4242)

## 🚀 Deploy to Production

See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) for complete deployment instructions.

**Quick deploy checklist:**
1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend to Render
3. ✅ Deploy frontend to Render
4. ✅ Update environment variables
5. ✅ Test live application

## 📝 Default Data

**Serviceable Pincodes:**
- 500001
- 500002
- 500003
- 500004

**Admin Credentials:**
- PIN: 4242 (change in production!)

## 🛠️ Common Commands

### Backend
```bash
cd backend
yarn start       # Start server
yarn dev         # Start with nodemon (auto-reload)
```

### Frontend
```bash
cd frontend
yarn start       # Start dev server
yarn build       # Build for production
yarn test        # Run tests
```

## 📚 Next Steps

1. **Add Products**: Login as admin → Add products
2. **Test Orders**: Place a test order from customer view
3. **Customize**: Update colors, branding, features
4. **Deploy**: Follow deployment guide for Render
5. **Monitor**: Check logs regularly

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `MONGO_URL` in `.env`
- Check port 8001 is available

**Frontend can't connect:**
- Verify `REACT_APP_BACKEND_URL` in `.env`
- Check backend is running
- Check CORS configuration

**MongoDB connection failed:**
- Verify MongoDB is running: `mongosh` or `mongo`
- Check connection string format
- For Atlas: verify IP whitelist

## 📖 Documentation

- [README.md](./README.md) - Full documentation
- [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) - Deployment guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Deployment checklist

## 💡 Tips

- Use `.env.example` files as templates
- Never commit `.env` files to Git
- Change admin PIN before production
- Use MongoDB Atlas for production
- Enable CORS whitelist in production

## 🎉 You're Ready!

Start building your meat shop e-commerce platform! 🥩🍗

Need help? Check the documentation or logs for errors.
