const Permission = require('../models/Permission');
const apiResponse = require('../utils/apiResponse');

// Get all permissions
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    return apiResponse.success(res, permissions, 'Permissions retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Create permission
const createPermission = async (req, res) => {
  try {
    const { name, action, resource, description } = req.body;
    
    // Check if permission already exists
    const permissionExists = await Permission.findOne({ name });
    if (permissionExists) {
      return apiResponse.error(res, 'Permission already exists', 400);
    }
    
    const permission = await Permission.create({
      name,
      action,
      resource,
      description
    });
    
    return apiResponse.success(res, permission, 'Permission created successfully', 201);
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Update permission
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, action, resource, description } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (action) updateData.action = action;
    if (resource) updateData.resource = resource;
    if (description) updateData.description = description;
    
    const permission = await Permission.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!permission) {
      return apiResponse.error(res, 'Permission not found', 404);
    }
    
    return apiResponse.success(res, permission, 'Permission updated successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Delete permission
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const permission = await Permission.findByIdAndDelete(id);
    
    if (!permission) {
      return apiResponse.error(res, 'Permission not found', 404);
    }
    
    return apiResponse.success(res, null, 'Permission deleted successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

module.exports = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
};