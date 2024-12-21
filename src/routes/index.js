const express = require('express');
const logger = require('../config/logger');

const router = express.Router();

/**
 * @route GET /health
 * @description Health check endpoint
 * @access Public
 */
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

/**
 * @route GET /
 * @description Home page endpoint
 * @access Public
 */
router.get('/', (req, res) => {
    logger.info('Home page accessed');
    res.render('index', {
        currentTime: new Date().toLocaleString()
    });
});

module.exports = router;
