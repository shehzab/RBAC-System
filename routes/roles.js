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


router.use(authenticate);

router.get('/', getRoles);
router.post('/', authenticate, requireVerified, authorize('manage_roles'), validateRequest(roleSchema), createRole);
router.put('/:id', authenticate, requireVerified, authorize('manage_roles'), validateRequest(roleSchema), updateRole);
router.delete('/:id', authenticate, requireVerified, authorize('manage_roles'), deleteRole);
;

module.exports = router;