const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../middleware/auth');
const logger = require('../config/logger');

const router = express.Router();

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        try {
            // Generate JWT
            const token = generateToken(req.user);

            // Set JWT cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            res.redirect('/dashboard');
        } catch (error) {
            logger.error('Authentication callback error:', error);
            res.redirect('/login?error=auth_failed');
        }
    }
);

// Logout endpoint
router.post('/logout', (req, res) => {
    req.logout(() => {
        res.clearCookie('token');
        res.json({ success: true });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.json({ authenticated: false });
    }

    res.json({
        authenticated: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            picture: req.user.picture
        }
    });
});

module.exports = router;
