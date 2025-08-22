const apiResponse = require('../utils/apiResponse');

const requireVerified = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return apiResponse.error(res, 'Email verification required. Please check your email.', 403);
  }
  next();
};

module.exports = requireVerified;