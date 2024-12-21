const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRY = '24h';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Token verification failed:', error);
        res.status(401).json({ 
            success: false, 
            error: 'Invalid token.' 
        });
    }
};

// Check if user is authenticated
const isAuthenticated = (req) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return false;

    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    isAuthenticated,
    JWT_SECRET
};
