const RolePermissionMap = require('../models/RolePermissionMap');
const Permission = require('../models/Permission');
const apiResponse = require('../utils/apiResponse');

const authorize = (permissionName) => {
  return async (req, res, next) => {
    try {
      // Check if user is logged in
      if (!req.user) {
        console.log('No user in request');
        return apiResponse.error(res, 'Authentication required', 401);
      }

      console.log('Checking permission:', permissionName, 'for user:', req.user._id);

      // Find the permission document by name
      const permissionDoc = await Permission.findOne({ name: permissionName });
      if (!permissionDoc) {
        console.log('Permission not found:', permissionName);
        return apiResponse.error(res, 'Permission not found', 500);
      }

      // Extract roleId ObjectId (handle cases where roleId is a populated object)
      const roleId = req.user.roleId._id ? req.user.roleId._id : req.user.roleId;

      // Check if the user's role has this permission
      const hasPermission = await RolePermissionMap.findOne({
        roleId: roleId,
        permissionId: permissionDoc._id
      }).populate('permissionId');

      if (!hasPermission) {
        console.log('Permission denied. User role:', roleId, 'does not have permission:', permissionName);
        return apiResponse.error(res, 'Not authorized to access this route', 403);
      }

      console.log('Permission granted');
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return apiResponse.error(res, 'Server Error', 500);
    }
  };
};

module.exports = authorize;
