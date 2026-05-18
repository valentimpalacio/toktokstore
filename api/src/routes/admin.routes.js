const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// Inventory management
router.get('/inventory', adminController.getInventory);

// User management
router.get('/users', adminController.getUsers);

// Order management
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);

// Category statistics
router.get('/categories/stats', adminController.getCategoryStats);

module.exports = router;
