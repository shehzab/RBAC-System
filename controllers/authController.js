const User = require('../models/User');
const Role = require('../models/Role');
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
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return apiResponse.error(res, 'User already exists', 400);
    }
    
    // Get default role (user role)
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) {
      return apiResponse.error(res, 'Default role not found', 500);
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      roleId: defaultRole._id
    });
    
    // Generate tokens
    const accessToken = generateToken({ id: user._id });
    const refreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();
    
    // Save refresh token
    await user.addRefreshToken(refreshToken, refreshTokenExpiry);
    
    // Return response
    return apiResponse.success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: defaultRole.name
      }
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Registration error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).populate('roleId');
    if (!user) {
      return apiResponse.error(res, 'Invalid credentials', 401);
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return apiResponse.error(res, 'Invalid credentials', 401);
    }
    
    // Generate tokens
    const accessToken = generateToken({ id: user._id });
    const refreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();
    
    // Save refresh token
    await user.addRefreshToken(refreshToken, refreshTokenExpiry);
    
    // Return response
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

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token is required', 400);
    }
    
    // Verify refresh token
    let decoded;
    try {
      decoded = verifyToken(refreshToken, true);
    } catch (error) {
      return apiResponse.error(res, 'Invalid refresh token', 401);
    }
    
    // Find user
    const user = await User.findById(decoded.id).populate('roleId');
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    // Check if refresh token is valid
    if (!user.isValidRefreshToken(refreshToken)) {
      return apiResponse.error(res, 'Refresh token expired or invalid', 401);
    }
    
    // Generate new tokens
    const newAccessToken = generateToken({ id: user._id });
    const newRefreshToken = generateToken({ id: user._id }, true);
    const refreshTokenExpiry = getRefreshTokenExpiry();
    
    // Replace old refresh token with new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken, refreshTokenExpiry);
    
    // Return response
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

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return apiResponse.error(res, 'Refresh token is required', 400);
    }
    
    // Find user by refresh token
    const user = await User.findOne({
      'refreshTokens.token': refreshToken
    });
    
    if (user) {
      // Remove the refresh token
      await user.removeRefreshToken(refreshToken);
    }
    
    return apiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Logout all devices
const logoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user) {
      // Clear all refresh tokens
      user.refreshTokens = [];
      await user.save();
    }
    
    return apiResponse.success(res, null, 'Logged out from all devices successfully');
  } catch (error) {
    console.error('Logout all error:', error);
    return apiResponse.error(res, 'Server Error', 500);
  }
};


// Forgot password (simplified version)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    // In a real application, generate a reset token, 
    // send an email, and handle the reset process
    // For simplicity, we'll just return a success message
    
    return apiResponse.success(res, null, 'Password reset instructions sent to your email');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // In a real application, verify the reset token
    // and update the password accordingly
    // For simplicity, we'll just return a success message
    
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
  resetPassword
};