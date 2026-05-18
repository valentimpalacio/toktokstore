const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getMe, refreshToken, logout } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');

// Public routes
router.post(
  '/register',
  validateBody(registerSchema),
  register
);

router.post(
  '/login',
  validateBody(loginSchema),
  login
);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.post('/refresh', authMiddleware, refreshToken);
router.post('/logout', authMiddleware, logout);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google` }),
  (req, res) => {
    const { user, token } = req.user;
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}&user=${userData}`);
  }
);

module.exports = router;
