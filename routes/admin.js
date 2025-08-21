const express = require('express');
const {
  assignRoleToUser,
  assignPermissionToRole,
  removePermissionFromRole
} = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validateRequest = require('../middleware/validation');
const { assignRoleSchema, assignPermissionSchema } = require('../schemas');

const router = express.Router();

// All routes are protected and require admin privileges
router.use(authenticate);
router.use(authorize('manage_users')); // Only users with manage_users permission can access admin routes

router.patch('/users/:userId/role', validateRequest(assignRoleSchema), assignRoleToUser);
router.post('/roles/:roleId/permissions', validateRequest(assignPermissionSchema), assignPermissionToRole);
router.delete('/roles/:roleId/permissions/:permissionId', removePermissionFromRole);

module.exports = router;