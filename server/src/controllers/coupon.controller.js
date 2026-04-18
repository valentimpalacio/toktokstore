const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const { createCouponSchema } = require('../utils/validationSchemas');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Get all coupons (admin only)
const getCoupons = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isActive } = req.query;

  const skip = (page - 1) * limit;
  const where = {};
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.coupon.count({ where })
  ]);

  res.json({
    success: true,
    data: coupons,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Validate and get coupon details
const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw errors.VALIDATION_ERROR('Coupon code is required');
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code }
  });

  if (!coupon) {
    throw errors.NOT_FOUND('Coupon');
  }

  // Check if coupon is valid
  const now = new Date();
  if (!coupon.isActive) {
    throw errors.VALIDATION_ERROR('This coupon is not active');
  }

  if (now > coupon.expiresAt) {
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { isActive: false }
    });
    throw errors.VALIDATION_ERROR('This coupon has expired');
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw errors.VALIDATION_ERROR('This coupon has reached its maximum usage limit');
  }

  res.json({
    success: true,
    data: {
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      expiresAt: coupon.expiresAt
    }
  });
});

// Create coupon (admin only)
const createCoupon = asyncHandler(async (req, res) => {
  const validatedData = createCouponSchema.parse(req.body);
  const { code, discountPercentage, expiresAt, maxUses } = validatedData;

  const existing = await prisma.coupon.findUnique({
    where: { code }
  });

  if (existing) {
    throw errors.CONFLICT('Coupon code already exists');
  }

  const coupon = await prisma.coupon.create({
    data: {
      code,
      discountPercentage,
      expiresAt: new Date(expiresAt),
      maxUses
    }
  });

  logger.info('Coupon created', { code, discountPercentage });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

// Update coupon (admin only)
const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  const { discountPercentage, expiresAt, isActive, maxUses } = req.body;

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId }
  });

  if (!coupon) {
    throw errors.NOT_FOUND('Coupon');
  }

  const updateData = {};
  if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage;
  if (expiresAt !== undefined) updateData.expiresAt = new Date(expiresAt);
  if (isActive !== undefined) updateData.isActive = isActive;
  if (maxUses !== undefined) updateData.maxUses = maxUses;

  const updated = await prisma.coupon.update({
    where: { id: couponId },
    data: updateData
  });

  logger.info('Coupon updated', { couponId });

  res.json({
    success: true,
    message: 'Coupon updated successfully',
    data: updated
  });
});

// Delete coupon (admin only)
const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId }
  });

  if (!coupon) {
    throw errors.NOT_FOUND('Coupon');
  }

  await prisma.coupon.delete({
    where: { id: couponId }
  });

  logger.info('Coupon deleted', { couponId });

  res.json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});

module.exports = {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
};
