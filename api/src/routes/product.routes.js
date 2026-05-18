const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory
} = require('../controllers/product.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const { validateBody, validateQuery } = require('../middleware/validate.middleware');
const { createProductSchema, updateProductSchema, productFilterSchema } = require('../utils/validationSchemas');

// Public routes
router.get('/', validateQuery(productFilterSchema), getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validateBody(createProductSchema),
  createProduct
);

router.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validateBody(updateProductSchema),
  updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

// Category routes
router.post(
  '/categories',
  authMiddleware,
  adminMiddleware,
  createCategory
);

module.exports = router;
