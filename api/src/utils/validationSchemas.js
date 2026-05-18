const { z } = require('zod');

// Auth schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().nonempty('Password is required')
});

// Product schemas
const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  image: z.string().url('Invalid image URL').optional(),
  categoryId: z.string().uuid('Invalid category ID')
});

const updateProductSchema = createProductSchema.partial();

// Order schemas
const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().int().min(1, 'Quantity must be at least 1')
    })
  ).min(1, 'Order must contain at least one item'),
  couponCode: z.string().optional()
});

// Rating schema
const createRatingSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(500, 'Comment cannot exceed 500 characters')
});

// Wishlist schema
const addWishlistSchema = z.object({
  productId: z.string().uuid('Invalid product ID')
});

// Coupon schema
const createCouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code cannot exceed 20 characters'),
  discountPercentage: z.number().min(1).max(100, 'Discount must be between 1 and 100'),
  expiresAt: z.string().datetime('Invalid date format'),
  maxUses: z.number().int().positive('Max uses must be positive').optional()
});

// Query schemas
const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').transform(Number).optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional(),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional()
});

const productFilterSchema = paginationSchema.extend({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().regex(/^\d+$/, 'Min price must be a number').transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+$/, 'Max price must be a number').transform(Number).optional(),
  inStock: z.string().transform(val => val === 'true').optional()
});

module.exports = {
  // Auth
  registerSchema,
  loginSchema,
  // Products
  createProductSchema,
  updateProductSchema,
  // Orders
  createOrderSchema,
  // Ratings
  createRatingSchema,
  // Wishlist
  addWishlistSchema,
  // Coupons
  createCouponSchema,
  // Queries
  paginationSchema,
  productFilterSchema
};
