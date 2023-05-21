const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User.model');
const { NotFoundError, CreateResourceError, UnauthenticatedError } = require('../errors');


/**
 * Controller to register a new user
 * This function handles the registration process for a new user.
 * It verifies that the role specified in the request body is 'user',
 * creates a new user using the User model, and generates a JWT token
 * for the user. It then sends the response with the user's name and token.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>} A Promise that resolves to the response sent
 */
const register = async (req, res, next) => {
    const role = req.body.role;
    if (role !== 'user') {
        return next(new UnauthenticatedError('You cannot register as admin'));
    }
    const user = await User.create({ ...req.body });
    if (!user) {
        return next(new CreateResourceError('Something went wrong while creating user'));
    }
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ name: user.name, token });
};
/**
 * Controller to login a user
 * This function handles the login process for a user.
 * It verifies that the user exists in the database, and then
 * compares the password provided in the request body with the
 * password stored in the database. If the passwords match, it
 * generates a JWT token for the user and sends the response with
 * the user's name and token.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>} A Promise that resolves to the response sent
 */
const login = async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        return next(new NotFoundError(`No user with email or username ${email || username} found`));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new UnauthenticatedError('Incorrect Password'));
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ name: user.name, token });
};

module.exports = {
    register,
    login,
};