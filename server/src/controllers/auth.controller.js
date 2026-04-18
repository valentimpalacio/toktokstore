const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { asyncHandler, errors } = require('../utils/errorHandler');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');
const logger = require('../utils/logger');

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register new user
const register = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  const { email, password, name } = validatedData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw errors.CONFLICT('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  // Generate token
  const token = generateToken(user);

  logger.info('User registered', { userId: user.id, email });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw errors.VALIDATION_ERROR('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logger.warn('Failed login attempt', { email });
    throw errors.VALIDATION_ERROR('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user);

  logger.info('User logged in', { userId: user.id, email });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    }
  });
});

// Get current user info
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true }
      }
    }
  });

  if (!user) {
    throw errors.NOT_FOUND('User');
  }

  res.json({
    success: true,
    data: user
  });
});

// Refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user) {
    throw errors.UNAUTHORIZED();
  }

  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Token refreshed',
    data: { token }
  });
});

// Logout (client-side action, but can be used for blacklisting on backend if needed)
const logout = asyncHandler(async (req, res) => {
  // Token invalidation would be handled on client side
  // This is here for completeness
  logger.info('User logged out', { userId: req.user.id });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  logout
};
