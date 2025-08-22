const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const validateRequest = require('../middleware/validation');
const authenticate = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../schemas');

const router = express.Router();

// Add refresh token schema to schemas/index.js
// refreshTokenSchema = Joi.object({ refreshToken: Joi.string().required() })

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshToken);
router.post('/logout', validateRequest(refreshTokenSchema), logout);
router.post('/logout-all', authenticate, logoutAll);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

module.exports = router;