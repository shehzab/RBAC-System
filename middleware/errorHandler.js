const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {

   logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user._id : 'anonymous'
  }); 

  let error = { ...err };
  error.message = err.message;
  
  // Log to console for dev
  console.log(err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return apiResponse.error(res, message, 404);
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return apiResponse.error(res, message, 400);
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    return apiResponse.error(res, 'Validation Error', 400, message);
  }
  
  return apiResponse.error(res, error.message || 'Server Error', 500);
};

module.exports = errorHandler;