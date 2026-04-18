const { z } = require('zod');
const { AppError } = require('../utils/errorHandler');

/**
 * Validate request body against a Zod schema
 * @param {import('zod').ZodSchema} schema 
 */
const validateBody = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.validatedData = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
        code: 'VALIDATION_ERROR'
      });
    }
    throw error;
  }
};

/**
 * Validate request query parameters against a Zod schema
 * @param {import('zod').ZodSchema} schema 
 */
const validateQuery = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.query);
    req.query = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors: formattedErrors,
        code: 'VALIDATION_ERROR'
      });
    }
    throw error;
  }
};

// For backwards compatibility
const validate = (schema) => validateBody(schema);

module.exports = { validate, validateBody, validateQuery };
