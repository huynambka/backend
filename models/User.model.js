const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { EMAIL_REGEX } = require('../config/constants');
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            maxLength: [20, 'Username must be at most 20 characters long'],
        },
        email: {
            type: String,
            required: [true, 'Please provide email'],
            match: [
                EMAIL_REGEX,
                'Please provide valid email',
            ],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        avatar: {
            type: String,
        },
        bio: {
            type: String,
            maxLength: [200, 'Bio must be at most 200 characters long'],
        },
        saved_posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        role: {
            type: String,
            default: 'user',
        },
    },
    {
        timestamps: true,
    },
);


// Encrypt password before saving to database
/**
 * Middleware to encrypt password before saving to database
 */
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

/**
 * Method to compare password
 * @param password
 * @returns {Promise<*>}
 */
UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

/**
 * Method to create JWT
 * @returns {*}
 */
UserSchema.methods.createJWT = function() {
    return jwt.sign(
        { userId: this._id, username: this.username, role: this.role },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_LIFETIME,
        },
    );
};


module.exports = mongoose.model('User', UserSchema);
