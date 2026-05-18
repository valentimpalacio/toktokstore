const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const { createRatingSchema } = require('../utils/validationSchemas');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Get all ratings for a product
const getRatings = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  
  if (!product) {
    throw errors.NOT_FOUND('Product');
  }

  const skip = (page - 1) * limit;
  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: { productId },
      include: { user: { select: { name: true, email: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.rating.count({ where: { productId } })
  ]);

  const averageRating = await prisma.rating.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true
  });

  res.json({
    success: true,
    data: ratings,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    summary: {
      averageRating: averageRating._avg.rating || 0,
      totalRatings: averageRating._count
    }
  });
});

// Create or update rating
const createRating = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const validatedData = createRatingSchema.parse(req.body);
  const { productId, rating, comment } = validatedData;

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  
  if (!product) {
    throw errors.NOT_FOUND('Product');
  }

  // Check if product was purchased by user
  const purchasedProduct = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ['DELIVERED', 'SHIPPED'] }
      }
    }
  });

  if (!purchasedProduct) {
    throw errors.FORBIDDEN('You can only rate products you have purchased');
  }

  // Create or update rating
  const existingRating = await prisma.rating.findUnique({
    where: {
      productId_userId: { productId, userId }
    }
  });

  let result;
  if (existingRating) {
    result = await prisma.rating.update({
      where: { id: existingRating.id },
      data: { rating, comment },
      include: { user: { select: { name: true } } }
    });
    logger.info('Rating updated', { productId, userId });
  } else {
    result = await prisma.rating.create({
      data: {
        productId,
        userId,
        rating,
        comment
      },
      include: { user: { select: { name: true } } }
    });
    logger.info('Rating created', { productId, userId });
  }

  res.status(201).json({
    success: true,
    message: 'Rating saved successfully',
    data: result
  });
});

// Delete rating
const deleteRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  const userId = req.user.id;

  const rating = await prisma.rating.findUnique({
    where: { id: ratingId }
  });

  if (!rating) {
    throw errors.NOT_FOUND('Rating');
  }

  if (rating.userId !== userId) {
    throw errors.FORBIDDEN('You can only delete your own ratings');
  }

  await prisma.rating.delete({
    where: { id: ratingId }
  });

  logger.info('Rating deleted', { ratingId, userId });

  res.json({
    success: true,
    message: 'Rating deleted successfully'
  });
});

module.exports = {
  getRatings,
  createRating,
  deleteRating
};
