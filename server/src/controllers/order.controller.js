const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const { createOrderSchema } = require('../utils/validationSchemas');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Create new order
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const validatedData = createOrderSchema.parse(req.body);
  const { items, couponCode } = validatedData;

  // Verify all products exist and have enough stock
  const productsData = await prisma.product.findMany({
    where: { id: { in: items.map(item => item.productId) } }
  });

  if (productsData.length !== items.length) {
    throw errors.NOT_FOUND('One or more products not found');
  }

  // Check stock for each item
  for (const item of items) {
    const product = productsData.find(p => p.id === item.productId);
    if (product.stock < item.quantity) {
      throw errors.VALIDATION_ERROR(`Not enough stock for ${product.name}. Available: ${product.stock}`);
    }
  }

  // Calculate total
  let total = 0;
  for (const item of items) {
    const product = productsData.find(p => p.id === item.productId);
    total += product.price * item.quantity;
  }

  // Apply coupon if provided
  let couponId = null;
  let discount = 0;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode }
    });

    if (!coupon) {
      throw errors.NOT_FOUND('Coupon');
    }

    const now = new Date();
    if (!coupon.isActive || now > coupon.expiresAt) {
      throw errors.VALIDATION_ERROR('Coupon is not valid or has expired');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw errors.VALIDATION_ERROR('Coupon has reached maximum usage limit');
    }

    discount = (total * coupon.discountPercentage) / 100;
    total = Math.max(0, total - discount);
    couponId = coupon.id;
  }

  // Create order with transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        couponId,
        items: {
          create: items.map(item => {
            const product = productsData.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price
            };
          })
        }
      },
      include: {
        items: { include: { product: true } },
        coupon: true
      }
    });

    // Reduce product stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // Increment coupon usage if applied
    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    return newOrder;
  });

  logger.info('Order created', {
    orderId: order.id,
    userId,
    total,
    discount,
    itemCount: items.length
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// Get user's orders
const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const skip = (page - 1) * limit;
  const where = { userId };

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { select: { name: true, image: true } } } },
        coupon: { select: { code: true } }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.count({ where })
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get single order
const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: true } },
      coupon: true
    }
  });

  if (!order) {
    throw errors.NOT_FOUND('Order');
  }

  // Check if user owns this order (unless admin)
  if (order.userId !== userId && req.user.role !== 'ADMIN') {
    throw errors.FORBIDDEN('You do not have permission to view this order');
  }

  res.json({
    success: true,
    data: order
  });
});

// Cancel order (user can only cancel pending orders)
const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) {
    throw errors.NOT_FOUND('Order');
  }

  if (order.userId !== userId) {
    throw errors.FORBIDDEN('You can only cancel your own orders');
  }

  if (order.status !== 'PENDING') {
    throw errors.VALIDATION_ERROR('Only pending orders can be cancelled');
  }

  // Cancel order and restore stock
  const updated = await prisma.$transaction(async (tx) => {
    const cancelledOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: true }
    });

    // Restore product stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      });
    }

    return cancelledOrder;
  });

  logger.info('Order cancelled', { orderId, userId });

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: updated
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
