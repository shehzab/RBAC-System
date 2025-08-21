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

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/', getRoles);
router.post('/', authorize('manage_roles'), validateRequest(roleSchema), createRole);
router.put('/:id', authorize('manage_roles'), validateRequest(roleSchema), updateRole);
router.delete('/:id', authorize('manage_roles'), deleteRole);

module.exports = router;