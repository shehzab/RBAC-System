const express = require('express');
const {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permissionController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validateRequest = require('../middleware/validation');
const { permissionSchema } = require('../schemas');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management endpoints
 */

// All routes are protected
router.use(authenticate);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Permissions retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       action:
 *                         type: string
 *                       resource:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getPermissions);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Create a new permission (Admin only)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - action
 *               - resource
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: manage_users
 *               action:
 *                 type: string
 *                 enum: [create, read, update, delete, manage]
 *                 example: manage
 *               resource:
 *                 type: string
 *                 example: users
 *               description:
 *                 type: string
 *                 example: Can manage all users
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Validation error or permission already exists
 *       403:
 *         description: Forbidden - requires manage_permissions permission
 *       500:
 *         description: Server error
 */
router.post('/', authorize('manage_permissions'), validateRequest(permissionSchema), createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Update a permission (Admin only)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: updated_permission_name
 *               action:
 *                 type: string
 *                 enum: [create, read, update, delete, manage]
 *                 example: read
 *               resource:
 *                 type: string
 *                 example: posts
 *               description:
 *                 type: string
 *                 example: Updated permission description
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - requires manage_permissions permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authorize('manage_permissions'), validateRequest(permissionSchema), updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Delete a permission (Admin only)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       403:
 *         description: Forbidden - requires manage_permissions permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authorize('manage_permissions'), deletePermission);

module.exports = router;