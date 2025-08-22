const express = require('express');
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roleController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validateRequest = require('../middleware/validation');
const { roleSchema } = require('../schemas');
const requireVerified = require('../middleware/requireVerified');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

router.use(authenticate);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
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
 *                   example: Roles retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', getRoles);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role (Requires manage_roles permission and verified email)
 *     tags: [Roles]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: moderator
 *               description:
 *                 type: string
 *                 example: Can moderate content
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Validation error or role already exists
 *       403:
 *         description: Forbidden - requires manage_roles permission and verified email
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, requireVerified, authorize('manage_roles'), validateRequest(roleSchema), createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role (Requires manage_roles permission and verified email)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: updated_role_name
 *               description:
 *                 type: string
 *                 example: Updated role description
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - requires manage_roles permission and verified email
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, requireVerified, authorize('manage_roles'), validateRequest(roleSchema), updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role (Requires manage_roles permission and verified email)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       403:
 *         description: Forbidden - requires manage_roles permission and verified email
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, requireVerified, authorize('manage_roles'), deleteRole);

module.exports = router;