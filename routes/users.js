const express = require('express');
const {
  getUsers,
  getProfile,
  updateProfile,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validateRequest = require('../middleware/validation');
const { updateProfileSchema } = require('../schemas');
const requireVerified = require('../middleware/requireVerified');

const router = express.Router();


router.use(authenticate);

router.get('/', authenticate, requireVerified, authorize('manage_users'), getUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateRequest(updateProfileSchema), updateProfile);
router.put('/:id', authenticate, requireVerified, authorize('manage_users'), validateRequest(updateProfileSchema), updateUser);
router.delete('/:id', authenticate, requireVerified, authorize('manage_users'), deleteUser);


module.exports = router;