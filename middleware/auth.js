const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // If no token, block access
    if (!token) {
      return apiResponse.error(res, 'Not authorized to access this route', 401);
    }
    
    try {
      // Verify token and fetch user
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).populate('roleId');
      
      if (!user) {
        return apiResponse.error(res, 'No user found with this id', 404);
      }

      // Restrict unverified users to limited routes
      if (!user.isEmailVerified) {
        const allowedRoutes = [
          '/api/users/profile',
          '/api/auth/verify-email',
          '/api/auth/resend-verification',
          '/api/auth/logout',
          '/api/auth/refresh-token'
        ];
        const isAllowedRoute = allowedRoutes.some(route => req.originalUrl.startsWith(route)); 
        
        if (!isAllowedRoute) {
          return apiResponse.error(res, 'Please verify your email address to access this resource', 403);
        }
      }
      
      // Attach user to request and continue
      req.user = user;
      next();
    } catch (error) {
      return apiResponse.error(res, 'Not authorized to access this route', 401);
    }
  } catch (error) {
    return apiResponse.error(res, 'Server Error', 500);
  }
};

module.exports = authenticate;
