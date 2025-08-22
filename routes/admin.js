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

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations requiring manage_users permission
 */

// All routes are protected and require admin privileges
router.use(authenticate);
router.use(authorize('manage_users')); // Only users with manage_users permission can access admin routes

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   patch:
 *     summary: Assign role to user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to assign role to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       400:
 *         description: Invalid request body
 *       403:
 *         description: Forbidden - requires manage_users permission
 *       404:
 *         description: User or role not found
 *       500:
 *         description: Server error
 */
router.patch('/users/:userId/role', validateRequest(assignRoleSchema), assignRoleToUser);

/**
 * @swagger
 * /api/admin/roles/{roleId}/permissions:
 *   post:
 *     summary: Assign permission to role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to assign permission to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c86
 *     responses:
 *       201:
 *         description: Permission assigned to role successfully
 *       400:
 *         description: Invalid request body or permission already assigned
 *       403:
 *         description: Forbidden - requires manage_users permission
 *       404:
 *         description: Role or permission not found
 *       500:
 *         description: Server error
 */
router.post('/roles/:roleId/permissions', validateRequest(assignPermissionSchema), assignPermissionToRole);

/**
 * @swagger
 * /api/admin/roles/{roleId}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove permission from role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to remove permission from
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID to remove
 *     responses:
 *       200:
 *         description: Permission removed from role successfully
 *       403:
 *         description: Forbidden - requires manage_users permission
 *       404:
 *         description: Role, permission, or assignment not found
 *       500:
 *         description: Server error
 */
router.delete('/roles/:roleId/permissions/:permissionId', removePermissionFromRole);

module.exports = router;