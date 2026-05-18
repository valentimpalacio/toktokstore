const serverless = require('serverless-http');
const { app } = require('../server/src/index');

// Initialize Prisma client
const { prisma } = require('../server/src/index');

// Create serverless handler
const handler = serverless(app, {
  request: (req, event) => {
    // Add Vercel-specific headers
    req.headers['x-forwarded-proto'] = 'https';
  }
});

// Export the handler for Vercel
module.exports.handler = async (event, context) => {
  try {
    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error('Serverless error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      })
    };
  }
};
