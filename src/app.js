const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const logger = require('./config/logger');
const securityMiddleware = require('./middleware/security');
const { notFound, globalErrorHandler } = require('./middleware/error');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3333;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3333',
    credentials: true
}));
app.use(compression());
securityMiddleware.forEach(middleware => app.use(middleware));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files with caching
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : '1d',
    etag: true
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.use('/', routes);

// Error handling
app.use(notFound);
app.use(globalErrorHandler);

// Start server (only if not running on Vercel)
if (process.env.NODE_ENV !== 'test' && process.env.VERCEL !== '1') {
    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel
module.exports = app;
