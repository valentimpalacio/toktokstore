const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { createRatingSchema } = require('../utils/validationSchemas');

// Get ratings for a product
router.get('/:productId', ratingController.getRatings);

// Create or update rating (protected)
router.post(
  '/',
  authMiddleware,
  validateBody(createRatingSchema),
  ratingController.createRating
);

// Delete rating (protected)
router.delete(
  '/:ratingId',
  authMiddleware,
  ratingController.deleteRating
);

module.exports = router;
