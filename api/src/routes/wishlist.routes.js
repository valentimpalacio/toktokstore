const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { addWishlistSchema } = require('../utils/validationSchemas');

// Get user's wishlist (protected)
router.get(
  '/',
  authMiddleware,
  wishlistController.getWishlist
);

// Add to wishlist (protected)
router.post(
  '/',
  authMiddleware,
  validateBody(addWishlistSchema),
  wishlistController.addToWishlist
);

// Check if product is in wishlist (protected)
router.get(
  '/:productId/check',
  authMiddleware,
  wishlistController.checkWishlist
);

// Remove from wishlist (protected)
router.delete(
  '/:productId',
  authMiddleware,
  wishlistController.removeFromWishlist
);

module.exports = router;
