const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
require('express-async-errors');

const app = express();
const PORT = process.env.PORT || 8001;
const HOST = '0.0.0.0';

// Ensure logs and uploads directories exist
const LOGS_DIR = path.join(__dirname, 'logs');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'meat_shop';

mongoose.connect(`${MONGO_URL}/${DB_NAME}`)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Admin PIN
const ADMIN_PIN = process.env.ADMIN_PIN || '4242';

// Serviceable pincodes
const SERVICEABLE_PINCODES = ['144411', '144401', '144402'];

// ===================== MONGOOSE SCHEMAS =====================

// Category Schema
const categorySchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4(), unique: true },
  name: { type: String, required: true, unique: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { collection: 'categories', versionKey: false });

const Category = mongoose.model('Category', categorySchema);

// Product Schema (removed enum to allow dynamic categories)
const productSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4(), unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: null },
  inStock: { type: Boolean, default: true },
  weight: { type: String, default: '500g' },
  description: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { collection: 'products', versionKey: false });

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  weight: { type: String, default: '500g' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4(), unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  paymentMode: { type: String, default: 'Cash on Delivery' },
  status: { type: String, default: 'PENDING', enum: ['PENDING', 'PACKED', 'OUT FOR DELIVERY', 'COMPLETED'] },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { collection: 'orders', versionKey: false });

const Order = mongoose.model('Order', orderSchema);

// ===================== MIDDLEWARE =====================

// CORS
const corsOrigins = process.env.CORS_ORIGINS || '*';
app.use(cors({
  origin: corsOrigins === '*' ? '*' : corsOrigins.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('combined'));

// Custom request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} - ${req.path}`);
  next();
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ===================== SEED DEFAULT CATEGORIES =====================

async function seedDefaultCategories() {
  try {
    const count = await Category.countDocuments({});
    if (count === 0) {
      const defaultCategories = [
        { id: uuidv4(), name: 'chicken', displayOrder: 1, createdAt: new Date().toISOString() },
        { id: uuidv4(), name: 'mutton', displayOrder: 2, createdAt: new Date().toISOString() },
        { id: uuidv4(), name: 'others', displayOrder: 3, createdAt: new Date().toISOString() }
      ];
      await Category.insertMany(defaultCategories);
      console.log('✅ Default categories seeded');
    }
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
  }
}

// Seed categories after DB connection
mongoose.connection.once('open', () => {
  seedDefaultCategories();
});

// ===================== ROUTES =====================

// Root route
app.get('/api', (req, res) => {
  res.json({ message: 'Fresh Meat Hub API - Welcome!' });
});

// ===================== PINCODE =====================

app.post('/api/check-pincode', (req, res) => {
  const { pincode } = req.body;
  const isServiceable = SERVICEABLE_PINCODES.includes(pincode);
  
  res.json({
    pincode: pincode,
    serviceable: isServiceable,
    message: isServiceable ? 'Service Available' : 'Not Serviceable in this area'
  });
});

// ===================== CATEGORIES =====================

// Get all categories
app.get('/api/categories', async (req, res) => {
  const categories = await Category.find({}).select('-_id').sort({ displayOrder: 1 }).lean();
  res.json(categories);
});

// Get single category
app.get('/api/categories/:category_id', async (req, res) => {
  const category = await Category.findOne({ id: req.params.category_id }).select('-_id').lean();
  
  if (!category) {
    return res.status(404).json({ detail: 'Category not found' });
  }
  
  res.json(category);
});

// Create category (Admin)
app.post('/api/categories', async (req, res) => {
  const { name, displayOrder } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ detail: 'Category name is required' });
  }
  
  // Check if category already exists
  const existing = await Category.findOne({ name: name.trim().toLowerCase() });
  if (existing) {
    return res.status(400).json({ detail: 'Category already exists' });
  }
  
  const categoryData = {
    id: uuidv4(),
    name: name.trim().toLowerCase(),
    displayOrder: displayOrder || 0,
    createdAt: new Date().toISOString()
  };
  
  const category = new Category(categoryData);
  await category.save();
  
  const savedCategory = await Category.findOne({ id: category.id }).select('-_id').lean();
  res.json(savedCategory);
});

// Update category (Admin)
app.put('/api/categories/:category_id', async (req, res) => {
  const updateData = req.body;
  
  // If updating name, normalize it
  if (updateData.name) {
    updateData.name = updateData.name.trim().toLowerCase();
    
    // Check if new name already exists (excluding current category)
    const existing = await Category.findOne({ 
      name: updateData.name,
      id: { $ne: req.params.category_id }
    });
    
    if (existing) {
      return res.status(400).json({ detail: 'Category name already exists' });
    }
  }
  
  // Remove null/undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === null || updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ detail: 'No update data provided' });
  }
  
  const result = await Category.updateOne(
    { id: req.params.category_id },
    { $set: updateData }
  );
  
  if (result.matchedCount === 0) {
    return res.status(404).json({ detail: 'Category not found' });
  }
  
  const updatedCategory = await Category.findOne({ id: req.params.category_id }).select('-_id').lean();
  res.json(updatedCategory);
});

// Delete category (Admin)
app.delete('/api/categories/:category_id', async (req, res) => {
  // Check if any products use this category
  const category = await Category.findOne({ id: req.params.category_id });
  if (!category) {
    return res.status(404).json({ detail: 'Category not found' });
  }
  
  const productsCount = await Product.countDocuments({ category: category.name });
  if (productsCount > 0) {
    return res.status(400).json({ 
      detail: `Cannot delete category. ${productsCount} products are using this category.` 
    });
  }
  
  const result = await Category.deleteOne({ id: req.params.category_id });
  
  if (result.deletedCount === 0) {
    return res.status(404).json({ detail: 'Category not found' });
  }
  
  res.json({ success: true, message: 'Category deleted' });
});

// ===================== ADMIN =====================

app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  
  if (pin === ADMIN_PIN) {
    res.json({ success: true, message: 'Access granted' });
  } else {
    res.status(401).json({ detail: 'Invalid PIN' });
  }
});

// ===================== PRODUCTS =====================

// Get all products (with optional category filter)
app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  
  const products = await Product.find(query).select('-_id').lean();
  res.json(products);
});

// Get single product
app.get('/api/products/:product_id', async (req, res) => {
  const product = await Product.findOne({ id: req.params.product_id }).select('-_id').lean();
  
  if (!product) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  
  res.json(product);
});

// Create product
app.post('/api/products', async (req, res) => {
  const productData = {
    ...req.body,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };
  
  const product = new Product(productData);
  await product.save();
  
  const savedProduct = await Product.findOne({ id: product.id }).select('-_id').lean();
  res.json(savedProduct);
});

// Update product
app.put('/api/products/:product_id', async (req, res) => {
  const updateData = req.body;
  
  // Remove null/undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === null || updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ detail: 'No update data provided' });
  }
  
  const result = await Product.updateOne(
    { id: req.params.product_id },
    { $set: updateData }
  );
  
  if (result.matchedCount === 0) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  
  const updatedProduct = await Product.findOne({ id: req.params.product_id }).select('-_id').lean();
  res.json(updatedProduct);
});

// Delete product
app.delete('/api/products/:product_id', async (req, res) => {
  const result = await Product.deleteOne({ id: req.params.product_id });
  
  if (result.deletedCount === 0) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  
  res.json({ success: true, message: 'Product deleted' });
});

// Image upload endpoint
app.post('/api/upload-image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }
    
    const base64Image = req.file.buffer.toString('base64');
    const contentType = req.file.mimetype || 'image/jpeg';
    const dataUrl = `data:${contentType};base64,${base64Image}`;
    
    res.json({ success: true, imageUrl: dataUrl });
  } catch (error) {
    res.status(500).json({ detail: `Image upload failed: ${error.message}` });
  }
});

// ===================== ORDERS =====================

// Get all orders
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({}).select('-_id').sort({ createdAt: -1 }).lean();
  res.json(orders);
});

// Create order
app.post('/api/orders', async (req, res) => {
  const { pincode } = req.body;
  
  // Validate pincode
  if (!SERVICEABLE_PINCODES.includes(pincode)) {
    return res.status(400).json({ detail: 'Pincode not serviceable' });
  }
  
  const orderData = {
    ...req.body,
    id: uuidv4(),
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  
  const order = new Order(orderData);
  await order.save();
  
  // Log order to file
  logOrderToFile(order);
  
  const savedOrder = await Order.findOne({ id: order.id }).select('-_id').lean();
  res.json(savedOrder);
});

// Update order status
app.put('/api/orders/:order_id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'PACKED', 'OUT FOR DELIVERY', 'COMPLETED'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      detail: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }
  
  const result = await Order.updateOne(
    { id: req.params.order_id },
    { $set: { status } }
  );
  
  if (result.matchedCount === 0) {
    return res.status(404).json({ detail: 'Order not found' });
  }
  
  const updatedOrder = await Order.findOne({ id: req.params.order_id }).select('-_id').lean();
  res.json(updatedOrder);
});

// Log order to file
function logOrderToFile(order) {
  try {
    const logFile = path.join(LOGS_DIR, 'orders.txt');
    const itemsStr = order.items.map(item => `${item.productName} x${item.quantity}`).join(', ');
    
    const logEntry = `
=====================================
Order ID: ${order.id}
Date: ${order.createdAt}
Customer: ${order.customerName}
Phone: ${order.phone}
Address: ${order.address}
Pincode: ${order.pincode}
Items: ${itemsStr}
Total: ₹${order.totalPrice}
Payment: ${order.paymentMode}
Status: ${order.status}
=====================================
`;
    
    fs.appendFileSync(logFile, logEntry);
    console.log(`Order ${order.id} logged to file`);
  } catch (error) {
    console.error(`Failed to log order: ${error.message}`);
  }
}

// ===================== STATS =====================

app.get('/api/stats', async (req, res) => {
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({});
  const pendingOrders = await Order.countDocuments({ status: 'PENDING' });
  const completedOrders = await Order.countDocuments({ status: 'COMPLETED' });
  
  // Calculate total revenue from completed orders
  const revenueResult = await Order.aggregate([
    { $match: { status: 'COMPLETED' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
  
  res.json({
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue
  });
});

// ===================== ERROR HANDLING =====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Internal server error'
  });
});

// ===================== SERVER START =====================

app.listen(PORT, HOST, () => {
  console.log(`🚀 Fresh Meat Hub Backend running on http://${HOST}:${PORT}`);
  console.log(`📊 Database: ${DB_NAME}`);
  console.log(`🔐 Admin PIN: ${ADMIN_PIN}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});
