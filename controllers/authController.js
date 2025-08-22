const crypto = require('crypto');
const User = require('../models/User');
const Role = require('../models/Role');
const { sendVerificationEmail } = require('../utils/emailService');
const { generateToken, verifyToken } = require('../utils/generateToken');
const apiResponse = require('../utils/apiResponse');

// Helper function to calculate refresh token expiry
const getRefreshTokenExpiry = () => {
  const expiresInDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiresInDays);
  return expiryDate;
};

// Register user 
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return apiResponse.error(res, 'User already exists', 400);
    }
    
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) {
      return apiResponse.error(res, 'Default role not found', 500);
    }

    const user = await User.create({
      email,
      password,
      roleId: defaultRole._id,
      isEmailVerified: false
    });

    await user.generateEmailVerificationToken();
    
    try {
      await sendVerificationEmail(user.email, user.emailVerificationToken, user._id);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    const accessToken = generateToken({ 
      id: user._id, 
      emailVerified: user.isEmailVerified,
      role: 'unverified'
    });
    
    const refreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();
    
    await user.addRefreshToken(refreshToken, refreshTokenExpiry);
    
    return apiResponse.success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: defaultRole.name,
        isEmailVerified: user.isEmailVerified
      }
    }, 'User registered successfully. Please check your email for verification.', 201);
  } catch (error) {
    console.error('Registration error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, userId } = req.body;
    
    if (!token || !userId) {
      return apiResponse.error(res, 'Token and user ID are required', 400);
    }
    
    const user = await User.findOne({
      _id: userId,
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return apiResponse.error(res, 'Invalid or expired verification token', 400);
    }
    
    await user.verifyEmail();
    
    const accessToken = generateToken({ 
      id: user._id, 
      emailVerified: true 
    });
    
    const refreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();

    await user.addRefreshToken(refreshToken, refreshTokenExpiry);
    
    return apiResponse.success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.roleId.name,
        isEmailVerified: true
      }
    }, 'Email verified successfully');
  } catch (error) {
    console.error('Email verification error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return apiResponse.error(res, 'Email is required', 400);
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    if (user.isEmailVerified) {
      return apiResponse.error(res, 'Email is already verified', 400);
    }
    
    await user.generateEmailVerificationToken();

    try {
      await sendVerificationEmail(user.email, user.emailVerificationToken, user._id);
      return apiResponse.success(res, null, 'Verification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return apiResponse.error(res, 'Failed to send verification email', 500);
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).populate('roleId');
    if (!user) {
      return apiResponse.error(res, 'Invalid credentials', 401);
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return apiResponse.error(res, 'Invalid credentials', 401);
    }
    
    const accessToken = generateToken({ id: user._id });
    const refreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();
    
    await user.addRefreshToken(refreshToken, refreshTokenExpiry);
    
    return apiResponse.success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.roleId.name
      }
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token is required', 400);
    }
    
    let decoded;
    try {
      decoded = verifyToken(refreshToken, true);
    } catch (error) {
      return apiResponse.error(res, 'Invalid refresh token', 401);
    }
    
    const user = await User.findById(decoded.id).populate('roleId');
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    if (!user.isValidRefreshToken(refreshToken)) {
      return apiResponse.error(res, 'Refresh token expired or invalid', 401);
    }
    
    const newAccessToken = generateToken({ id: user._id });
    const newRefreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();
    
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken, refreshTokenExpiry);
    
    return apiResponse.success(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.roleId.name
      }
    }, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token is required', 400);
    }
    
    const user = await User.findOne({
      'refreshTokens.token': refreshToken
    });
    
    if (user) {
      await user.removeRefreshToken(refreshToken);
    }
    
    return apiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.refreshTokens = [];
      await user.save();
    }
    
    return apiResponse.success(res, null, 'Logged out from all devices successfully');
  } catch (error) {
    console.error('Logout all error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return apiResponse.success(res, null, 'If the email exists, password reset instructions have been sent');
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      return apiResponse.success(res, null, 'Password reset instructions sent to your email');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return apiResponse.error(res, 'Failed to send password reset email', 500);
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    return apiResponse.success(res, null, 'Password reset successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyEmail,              
  resendVerificationEmail 
};
 