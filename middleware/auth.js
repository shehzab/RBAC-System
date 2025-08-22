const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return apiResponse.error(res, 'Not authorized to access this route', 401);
    }
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).populate('roleId');
      
      if (!user) {
        return apiResponse.error(res, 'No user found with this id', 404);
      }
      
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