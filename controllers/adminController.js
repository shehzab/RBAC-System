const User = require('../models/User');
const RolePermissionMap = require('../models/RolePermissionMap');
const apiResponse = require('../utils/apiResponse');

// Assign role to user
const assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { roleId },
      { new: true, runValidators: true }
    ).select('-password').populate('roleId');
    
    if (!user) {
      return apiResponse.error(res, 'User not found', 404);
    }
    
    return apiResponse.success(res, user, 'Role assigned to user successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Assign permission to role
const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionId } = req.body;
    
    // Check if mapping already exists
    const mappingExists = await RolePermissionMap.findOne({ roleId, permissionId });
    if (mappingExists) {
      return apiResponse.error(res, 'Permission already assigned to this role', 400);
    }
    
    const rolePermission = await RolePermissionMap.create({
      roleId,
      permissionId
    });
    
    await rolePermission.populate('permissionId');
    
    return apiResponse.success(res, rolePermission, 'Permission assigned to role successfully', 201);
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

// Remove permission from role
const removePermissionFromRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;
    
    const rolePermission = await RolePermissionMap.findOneAndDelete({
      roleId,
      permissionId
    });
    
    if (!rolePermission) {
      return apiResponse.error(res, 'Permission not assigned to this role', 404);
    }
    
    return apiResponse.success(res, null, 'Permission removed from role successfully');
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

module.exports = {
  assignRoleToUser,
  assignPermissionToRole,
  removePermissionFromRole
};