const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
require('dotenv').config();

const router = express.Router();

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SIGNING_KEY, (err, user) => {
        if (err) {
            console.error('Token verification error:', err); // Log the error
            return res.status(403).json({ success: false, error: 'Invalid token.' });
        }
        console.log('Verified User:', user); // Log the user object
        req.user = user; // Attach user to request object
        next();
    });
}

// Function to generate JWT
function generateToken(user) {
    const iat = Math.floor(Date.now() / 1000); // Current time in seconds
    const exp = iat + (60 * 60); // Token expires in 1 hour

    const payload = {
        sub: user.id, // Assuming user has an id property
        iat: iat,
        exp: exp
    };

    // Sign the JWT using your signing key from the environment
    return jwt.sign(payload, process.env.JWT_SIGNING_KEY, { algorithm: 'HS256' });
}

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
            console.log('Generated Token:', token); // Log the generated token for debugging

            // Set JWT cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Set to false for development
                sameSite: 'lax', // Change to lax for testing
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
router.get('/me', authenticateToken, (req, res) => {
    res.json({
        authenticated: true,
        user: {
            id: req.user.sub,
            email: req.user.email,
            name: req.user.name,
            picture: req.user.picture
        }
    });
});

// Protect the dashboard route
router.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ success: true, message: 'Welcome to the dashboard!', user: req.user });
});

// Protect the dashboard route
router.get('/protected-dashboard', authenticateToken, (req, res) => {
    res.json({ success: true, message: 'Welcome to the protected dashboard!', user: req.user });
});

module.exports = router;
