const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Security Middlewares
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use(limiter);

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// Routes
const authRoutes = require('../server/src/routes/auth.routes');
const productRoutes = require('../server/src/routes/product.routes');
const orderRoutes = require('../server/src/routes/order.routes');
const ratingRoutes = require('../server/src/routes/rating.routes');
const wishlistRoutes = require('../server/src/routes/wishlist.routes');
const couponRoutes = require('../server/src/routes/coupon.routes');
const adminRoutes = require('../server/src/routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api', (req, res) => {
  res.json({ 
    message: 'TokTokStore API v2.0',
    version: '2.0.0',
    status: 'running'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'TokTokStore API v2.0',
    version: '2.0.0',
    status: 'running'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// Vercel serverless export
module.exports = async (req, res) => {
  return app(req, res);
};
