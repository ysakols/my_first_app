const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const logger = require('./config/logger');
const securityMiddleware = require('./middleware/security');
const { verifyToken, isAuthenticated } = require('./middleware/auth');
const { notFound, globalErrorHandler } = require('./middleware/error');
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');

// Initialize Passport config
require('./config/passport');

const app = express();
const port = process.env.PORT || 3333;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3333',
    credentials: true
}));
app.use(compression());
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

securityMiddleware.forEach(middleware => app.use(middleware));

// Static files with caching
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : '1d',
    etag: true
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Auth routes (public)
app.use('/auth', authRoutes);

// Public routes
app.get('/', (req, res) => {
    res.render('index', { 
        currentTime: new Date().toLocaleString(),
        isAuthenticated: req.isAuthenticated()
    });
});

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

app.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('register');
});

// Protected routes
app.use('/dashboard', verifyToken);
app.use('/api', verifyToken);
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
