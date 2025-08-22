const logger = require('../utils/logger');

const auditLogger = (req, res, next) => {
  const oldSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      logger.error({
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        userId: req.user ? req.user._id : 'anonymous',
        userAgent: req.get('User-Agent'),
        error: data
      });
    } else if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      logger.info({
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        userId: req.user ? req.user._id : 'anonymous',
        userAgent: req.get('User-Agent'),
        action: `${req.method} ${req.baseUrl}${req.path}`
      });
    }
    
    oldSend.apply(res, arguments);
  };
  next();
};

module.exports = auditLogger;