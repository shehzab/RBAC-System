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

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/', authorize('manage_users'), getUsers);
router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.put('/:id', authorize('manage_users'), validateRequest(updateProfileSchema), updateUser);
router.delete('/:id', authorize('manage_users'), deleteUser);

module.exports = router;