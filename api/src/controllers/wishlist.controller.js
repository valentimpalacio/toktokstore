const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Get user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const [wishlistItems, total] = await Promise.all([
    prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { category: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.wishlist.count({ where: { userId } })
  ]);

  res.json({
    success: true,
    data: wishlistItems.map(item => item.product),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw errors.NOT_FOUND('Product');
  }

  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: {
      productId_userId: { productId, userId }
    }
  });

  if (existing) {
    throw errors.CONFLICT('Product already in your wishlist');
  }

  const wishlistItem = await prisma.wishlist.create({
    data: {
      productId,
      userId
    },
    include: { product: true }
  });

  logger.info('Product added to wishlist', { productId, userId });

  res.status(201).json({
    success: true,
    message: 'Product added to wishlist',
    data: wishlistItem
  });
});

// Remove from wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      productId_userId: { productId, userId }
    }
  });

  if (!wishlistItem) {
    throw errors.NOT_FOUND('Product not in your wishlist');
  }

  await prisma.wishlist.delete({
    where: { id: wishlistItem.id }
  });

  logger.info('Product removed from wishlist', { productId, userId });

  res.json({
    success: true,
    message: 'Product removed from wishlist'
  });
});

// Check if product is in wishlist
const checkWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      productId_userId: { productId, userId }
    }
  });

  res.json({
    success: true,
    inWishlist: !!wishlistItem
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};
