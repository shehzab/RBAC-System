const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('roleId');
    return apiResponse.success(res, users, 'Users retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('roleId');
    return apiResponse.success(res, user, 'Profile retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('roleId');
    
    return apiResponse.success(res, user, 'Profile updated successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Update any user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, roleId } = req.body;
    
    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (roleId) updateData.roleId = roleId;
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('roleId');
    
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    return apiResponse.success(res, user, 'User updated successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    return apiResponse.success(res, null, 'User deleted successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

module.exports = {
  getUsers,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser
};