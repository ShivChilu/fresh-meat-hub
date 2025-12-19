# Fresh Meat Hub - MERN Stack Application

## 🎉 Successfully Migrated to MERN Stack!

This is a full-featured e-commerce application for a meat shop, built with the MERN stack.

## 📚 Technology Stack

### Backend
- **Node.js** v20.19.6
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.0.0 - ODM for MongoDB
- **Multer** - File upload handling
- **Morgan** - HTTP request logging

### Frontend
- **React** 19.0.0
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - Component library

## 🚀 Features

### Customer Features
- 📦 Browse products by category (Chicken, Mutton, Others)
- 🛒 Shopping cart functionality
- 📍 Pincode serviceability check
- 💳 Order placement with Cash on Delivery
- 📱 Responsive design

### Admin Features
- 🔐 PIN-based authentication
- ➕ Add/Edit/Delete products
- 📸 Image upload for products
- 📊 Dashboard with statistics
- 📋 Order management (PENDING → PACKED → OUT FOR DELIVERY → COMPLETED)
- 📝 Automatic order logging to file system

## 🏗️ Project Structure

```
/app/
├── backend/
│   ├── server.js           # Express.js server
│   ├── package.json        # Node.js dependencies
│   ├── .env               # Environment variables
│   ├── logs/              # Order logs
│   └── uploads/           # Uploaded files
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── context/      # React context
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=meat_shop
CORS_ORIGINS=*
ADMIN_PIN=4242
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://your-domain.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

## 📡 API Endpoints

### General
- `GET /api/` - Welcome message

### Admin
- `POST /api/admin/verify` - Verify admin PIN

### Pincode
- `POST /api/check-pincode` - Check if pincode is serviceable

### Products
- `GET /api/products` - Get all products (optional ?category=chicken)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/upload-image` - Upload product image (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Statistics
- `GET /api/stats` - Get dashboard statistics (Admin)

## 🏃 Running the Application

The application runs automatically via Supervisor:

```bash
# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
sudo supervisorctl restart all

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

## 📦 Installing Dependencies

### Backend
```bash
cd /app/backend
yarn install
```

### Frontend
```bash
cd /app/frontend
yarn install
```

## 🧪 Testing

### Manual Testing
```bash
# Test backend API
curl http://localhost:8001/api/

# Test products endpoint
curl http://localhost:8001/api/products

# Test stats
curl http://localhost:8001/api/stats
```

## 📝 Serviceable Pincodes

Currently serviceable pincodes:
- 500001
- 500002
- 500003
- 500004

## 🔒 Admin Access

Default admin PIN: **4242**

## 📊 Database Schema

### Products Collection
```javascript
{
  id: "uuid",
  name: "Product Name",
  price: 299,
  category: "chicken|mutton|others",
  image: "data:image/jpeg;base64,...",
  inStock: true,
  weight: "500g",
  description: "Description",
  createdAt: "2025-12-19T12:00:00.000Z"
}
```

### Orders Collection
```javascript
{
  id: "uuid",
  customerName: "Customer Name",
  phone: "1234567890",
  address: "Full Address",
  pincode: "500001",
  items: [
    {
      productId: "uuid",
      productName: "Product",
      quantity: 2,
      price: 299,
      weight: "500g"
    }
  ],
  totalPrice: 598,
  paymentMode: "Cash on Delivery",
  status: "PENDING|PACKED|OUT FOR DELIVERY|COMPLETED",
  createdAt: "2025-12-19T12:00:00.000Z"
}
```

## 🚀 Deployment

### Deploy to Render

This application is ready to deploy on Render (free tier available):

1. **Quick Start**: Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. **Detailed Guide**: See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
3. **One-Click Deploy**: Use `render.yaml` for automated setup

**What you'll need:**
- GitHub account
- Render account (free)
- MongoDB Atlas account (free)

**Deployment time:** ~15 minutes

### Deploy to Other Platforms

- **Vercel**: Deploy frontend only (backend requires separate hosting)
- **Heroku**: Both frontend and backend can be deployed
- **AWS/GCP/Azure**: Use EC2/Compute Engine/VM instances
- **DigitalOcean**: Use App Platform or Droplets

See deployment guide for platform-specific instructions.

## 🎯 Migration from FastAPI

This application was successfully migrated from FastAPI (Python) to Express.js (Node.js). See [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for detailed migration notes.

## 📚 Documentation

- **[README.md](./README.md)** - This file (overview and setup)
- **[RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)** - Complete Render deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment checklist
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - FastAPI to Express.js migration notes

## 📄 License

Private Project - Fresh Meat Hub
