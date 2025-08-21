const apiResponse = require('../utils/apiResponse');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return apiResponse.error(res, 'Validation failed', 400, errors);
    }
    
    next();
  };
};

module.exports = validateRequest;