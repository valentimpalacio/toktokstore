const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalOrders, totalRevenue, lowStockProducts, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['DELIVERED', 'SHIPPED'] } }
    }),
    prisma.product.findMany({
      where: { stock: { lte: 10 } },
      select: { id: true, name: true, stock: true, price: true }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true, price: true } }
      }
    })
  ]);

  // Calculate order statistics
  const orderStats = await prisma.order.groupBy({
    by: ['status'],
    _count: { id: true }
  });

  const statusCount = {};
  orderStats.forEach(stat => {
    statusCount[stat.status] = stat._count.id;
  });

  // Revenue by day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const revenuByDay = await prisma.order.groupBy({
    by: ['createdAt'],
    _sum: { total: true },
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { in: ['DELIVERED', 'SHIPPED'] }
    }
  });

  const stats = {
    users: totalUsers,
    orders: totalOrders,
    revenue: totalRevenue._sum.total || 0,
    orderStatus: statusCount,
    lowStockProducts: lowStockProducts.length,
    recentOrders: recentOrders.map(order => ({
      id: order.id,
      user: order.user.name,
      email: order.user.email,
      total: order.total,
      status: order.status,
      itemCount: order.items.length,
      createdAt: order.createdAt
    })),
    revenueByDay: revenuByDay.map(day => ({
      date: day.createdAt.toISOString().split('T')[0],
      revenue: day._sum.total
    }))
  };

  res.json({
    success: true,
    data: stats
  });
});

// Get all products with inventory
const getInventory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, lowStockOnly = false } = req.query;

  const skip = (page - 1) * limit;
  const where = lowStockOnly ? { stock: { lte: 10 } } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take: limit,
      orderBy: { stock: 'asc' }
    }),
    prisma.product.count({ where })
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;

  const skip = (page - 1) * limit;
  const where = {};

  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get all orders with details
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const skip = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;
  if (search) {
    where.user = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { name: true, image: true } } }
        }
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

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    throw errors.VALIDATION_ERROR('Invalid status');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    throw errors.NOT_FOUND('Order');
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { user: true, items: true }
  });

  logger.info('Order status updated', { orderId, status });

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: updated
  });
});

// Get category statistics
const getCategoryStats = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } }
    }
  });

  const statsWithSales = await Promise.all(
    categories.map(async (cat) => {
      const sales = await prisma.orderItem.aggregate({
        where: { product: { categoryId: cat.id } },
        _sum: { quantity: true, price: true }
      });

      return {
        id: cat.id,
        name: cat.name,
        productCount: cat._count.products,
        totalSales: sales._sum.quantity || 0,
        revenue: sales._sum.price || 0
      };
    })
  );

  res.json({
    success: true,
    data: statsWithSales
  });
});

module.exports = {
  getDashboardStats,
  getInventory,
  getUsers,
  getAllOrders,
  updateOrderStatus,
  getCategoryStats
};
