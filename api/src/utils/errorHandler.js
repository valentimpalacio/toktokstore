const logger = require('./logger');

class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  const isDevelopment = process.env.NODE_ENV === 'development';

  logger.error('Error occurred', {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    ...(isDevelopment && { stack: err.stack })
  });

  const errorResponse = {
    success: false,
    message: err.message,
    code: err.code,
    ...(isDevelopment && { stack: err.stack })
  };

  res.status(err.statusCode).json(errorResponse);
};

// Common error instances
const errors = {
  VALIDATION_ERROR: (message) => new AppError(message, 400, 'VALIDATION_ERROR'),
  UNAUTHORIZED: () => new AppError('Unauthorized access', 401, 'UNAUTHORIZED'),
  FORBIDDEN: () => new AppError('Forbidden access', 403, 'FORBIDDEN'),
  NOT_FOUND: (resource) => new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
  CONFLICT: (message) => new AppError(message, 409, 'CONFLICT'),
  INTERNAL_ERROR: (message = 'Internal server error') => new AppError(message, 500, 'INTERNAL_ERROR'),
  RATE_LIMIT: () => new AppError('Too many requests, please try again later', 429, 'RATE_LIMIT'),
};

module.exports = { AppError, asyncHandler, errorHandler, errors };
