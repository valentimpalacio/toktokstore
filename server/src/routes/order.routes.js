const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, cancelOrder } = require('../controllers/order.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { createOrderSchema } = require('../utils/validationSchemas');

// Protected routes - all require authentication
router.use(authMiddleware);

// Create new order
router.post('/', validateBody(createOrderSchema), createOrder);

// Get user's orders
router.get('/', getMyOrders);

// Get specific order
router.get('/:orderId', getOrderById);

// Cancel order
router.patch('/:orderId/cancel', cancelOrder);

module.exports = router;
