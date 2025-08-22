const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');   
const { createClient } = require('redis');
const logger = require('../utils/logger');   

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const redisLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP'
    },
    standardHeaders: true,
    legacyHeaders: false,

    // Custom handler for logging & custom response
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP'
        });
    }
});

module.exports = redisLimiter;
