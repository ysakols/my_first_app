const express = require('express');
const logger = require('../config/logger');

const router = express.Router();

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

/**
 * @route GET /dashboard
 * @description Dashboard endpoint
 * @access Public
 */
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

/**
 * @route GET /health
 * @description Health check endpoint
 * @access Public
 */
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

/**
 * @route POST /api/generate-docs
 * @description API endpoint for generating documentation
 * @access Public
 */
router.post('/api/generate-docs', async (req, res) => {
    try {
        const { projectName, description, audience, style } = req.body;

        // Here you would typically:
        // 1. Validate the input
        // 2. Process the Paragon data
        // 3. Generate documentation using your preferred method
        
        // For now, we'll return a sample response
        const sampleDoc = `
# ${projectName}

## Overview
${description}

## Target Audience
This documentation is designed for ${audience}.

## Style Guide
This documentation follows a ${style} approach.

## Getting Started
...
        `;

        res.json({
            success: true,
            content: sampleDoc
        });
    } catch (error) {
        console.error('Documentation generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate documentation'
        });
    }
});

module.exports = router;
