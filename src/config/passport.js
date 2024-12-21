require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const logger = require('./logger');

// In-memory user store (replace with database in production)
const users = new Map();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3333/auth/google/callback',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = users.get(profile.id);

        if (!user) {
            // Create new user
            user = {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: profile.photos[0].value,
                accessToken
            };
            users.set(profile.id, user);
            logger.info(`New user registered: ${user.email}`);
        } else {
            // Update existing user's access token
            user.accessToken = accessToken;
            users.set(profile.id, user);
            logger.info(`User logged in: ${user.email}`);
        }

        done(null, user);
    } catch (error) {
        logger.error('Google authentication error:', error);
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.get(id);
    done(null, user);
});

module.exports = {
    users
};
