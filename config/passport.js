/**
 This file configures passport for JWT authentication.
 It sets up two strategies: 'jwt' and 'admin'.
 Dependencies:
 dotenv: The dotenv module for loading environment variables.
 passport: The Passport module for authentication.
 passport-jwt: The Passport JWT module for JWT authentication strategy.
 UnauthenticatedError: Custom error class for unauthenticated requests.
 User: The User model for querying user data.
 Strategies:
 jwt: JWT authentication strategy for general user authentication.
 admin: JWT authentication strategy for admin user authentication.
 @module passport
 @requires dotenv
 @requires passport
 @requires passport-jwt
 @requires ../errors
 @requires ../models/User.model
 */
require('dotenv').config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {
    UnauthenticatedError,
} = require('../errors');

const User = require('../models/User.model');

/**
 JWT authentication strategy for general user authentication.
 @name jwt
 @memberof module:passport
 @instance
 @param {Object} options - Options for JWT authentication strategy
 @param {Function} verify - Verify callback function for JWT authentication
 */
passport.use(
    'jwt',
    new JwtStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
            passReqToCallback: true,
        },
        async (req, jwtPayload, done) => {
            const user = await User.findById(jwtPayload.userId);
            // Check if user is authenticated and if user is admin
            // If not, return an error
            if (user._id !== req.params.id && user.role !== 'admin') {
                return done(new UnauthenticatedError('Unauthenticated'));
            }
            if (!user) {
                return done(new UnauthenticatedError('Unauthenticated'));
            }
            return done(null, { userId: user._id, name: user.name });
        },
    ),
);
/**
 JWT authentication strategy for admin user authentication.
 @name admin
 @memberof module:passport
 @instance
 @param {Object} options - Options for JWT authentication strategy
 @param {Function} verify - Verify callback function for JWT authentication
 */
passport.use(
    'admin',
    new JwtStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        },
        async (jwtPayload, done) => {
            const user = await User.findById(jwtPayload.userId);
            if (!user) {
                return done(new UnauthenticatedError('Unauthenticated'));
            }
            // Check if user is admin
            if (user.role !== 'admin') {
                return done(new UnauthenticatedError('Unauthenticated'));
            }
            return done(null, { userId: user._id, name: user.name });
        },
    ),
);

module.exports = passport;