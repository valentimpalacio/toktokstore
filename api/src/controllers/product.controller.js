const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const {
  createProductSchema,
  updateProductSchema,
  productFilterSchema,
} = require('../utils/validationSchemas');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

// Get products with advanced filtering and pagination
const getProducts = asyncHandler(async (req, res) => {
  const validatedQuery = productFilterSchema.parse(req.query);
  const {
    category,
    search,
    minPrice,
    maxPrice,
    inStock,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    order = 'desc',
  } = validatedQuery;

  const where = {};

  if (category) {
    where.categoryId = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (inStock === true) {
    where.stock = { gt: 0 };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get single product with details
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw errors.NOT_FOUND('Product');
  }

  res.json({
    success: true,
    data: product,
  });
});

// Create product (admin only)
const createProduct = asyncHandler(async (req, res) => {
  const validatedData = createProductSchema.parse(req.body);
  const { name, description, price, stock, image, categoryId } = validatedData;

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw errors.NOT_FOUND('Category');
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      image,
      categoryId,
    },
    include: { category: true },
  });

  logger.info('Product created', { productId: product.id, name });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

// Update product (admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateProductSchema.parse(req.body);

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw errors.NOT_FOUND('Product');
  }

  // If category is being updated, verify it exists
  if (validatedData.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      throw errors.NOT_FOUND('Category');
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: validatedData,
    include: { category: true },
  });

  logger.info('Product updated', { productId: id });

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updated,
  });
});

// Delete product (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw errors.NOT_FOUND('Product');
  }

  await prisma.product.delete({
    where: { id },
  });

  logger.info('Product deleted', { productId: id });

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

// Get categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  res.json({
    success: true,
    data: categories,
  });
});

// Create category (admin only)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw errors.VALIDATION_ERROR('Category name is required');
  }

  const existing = await prisma.category.findUnique({
    where: { name: name.trim() },
  });

  if (existing) {
    throw errors.CONFLICT('Category already exists');
  }

  const category = await prisma.category.create({
    data: { name: name.trim() },
  });

  logger.info('Category created', { categoryId: category.id, name });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
};
