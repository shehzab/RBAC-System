const Role = require('../models/Role');
const apiResponse = require('../utils/apiResponse');

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return apiResponse.success(res, roles, 'Roles retrieved successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Create role
const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // console.log('Creating role with data:', { name, description });
    
    // Check if role already exists
    const roleExists = await Role.findOne({ name: name.toLowerCase() });
    if (roleExists) {
    //   console.log('Role already exists:', name);
      return apiResponse.error(res, 'Role already exists', 400);
    }
    
    const role = await Role.create({
      name: name.toLowerCase(),
      description
    });
    
    // console.log('Role created successfully:', role);
    return apiResponse.success(res, role, 'Role created successfully', 201);
  } catch (error) {
    console.error('Error creating role:', error);
    // Return more specific error messages
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return apiResponse.error(res, 'Validation Error', 400, errors);
    }
    if (error.code === 11000) {
      return apiResponse.error(res, 'Role already exists', 400);
    }
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name.toLowerCase();
    if (description) updateData.description = description;
    
    const role = await Role.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!role) {
      return apiResponse.error(res, 'Role not found', 404);
    }
    
    return apiResponse.success(res, role, 'Role updated successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findByIdAndDelete(id);
    
    if (!role) {
      return apiResponse.error(res, 'Role not found', 404);
    }
    
    return apiResponse.success(res, null, 'Role deleted successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole
};