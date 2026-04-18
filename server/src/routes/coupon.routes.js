const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const { validateBody, validateQuery } = require('../middleware/validate.middleware');
const { createCouponSchema, paginationSchema } = require('../utils/validationSchemas');

// Validate coupon (public)
router.get(
  '/validate/:code',
  couponController.validateCoupon
);

// Get all coupons (admin only)
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  validateQuery(paginationSchema),
  couponController.getCoupons
);

// Create coupon (admin only)
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validateBody(createCouponSchema),
  couponController.createCoupon
);

// Update coupon (admin only)
router.patch(
  '/:couponId',
  authMiddleware,
  adminMiddleware,
  couponController.updateCoupon
);

// Delete coupon (admin only)
router.delete(
  '/:couponId',
  authMiddleware,
  adminMiddleware,
  couponController.deleteCoupon
);

module.exports = router;
