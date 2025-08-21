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

// All routes are protected
router.use(authenticate);

router.get('/', getPermissions);
router.post('/', authorize('manage_permissions'), validateRequest(permissionSchema), createPermission);
router.put('/:id', authorize('manage_permissions'), validateRequest(permissionSchema), updatePermission);
router.delete('/:id', authorize('manage_permissions'), deletePermission);

module.exports = router;