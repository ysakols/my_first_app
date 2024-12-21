const logger = require('../config/logger');

/**
 * Custom error class for application errors
 */
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Handle 404 errors
 */
const notFound = (req, res) => {
    logger.error(`404 error: ${req.originalUrl} not found`);
    res.status(404).render('error', {
        message: 'Page not found'
    });
};

/**
 * Global error handler
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error('Server error:', { 
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode
    });

    res.status(err.statusCode).render('error', {
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message
    });
};

module.exports = {
    AppError,
    notFound,
    globalErrorHandler
};
