const User = require('../models/User');
const Role = require('../models/Role');
const generateToken = require('../utils/generateToken');
const apiResponse = require('../utils/apiResponse');

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
    
    // Generate token
    const token = generateToken({ id: user._id });
    
    // Return response
    return apiResponse.success(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: defaultRole.name
      }
    }, 'User registered successfully', 201);
  } catch (error) {
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
    
    // Generate token
    const token = generateToken({ id: user._id });
    
    // Return response
    return apiResponse.success(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.roleId.name
      }
    }, 'Login successful');
  } catch (error) {
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
    
    // In a real application, you would generate a reset token, 
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
    
    // In a real application, you would verify the reset token
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
  forgotPassword,
  resetPassword
};