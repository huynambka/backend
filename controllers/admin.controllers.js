const User = require('../models/User.model');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');


/**
 * Controller to get all users
 * This function handles the request to get all users.
 * It uses the User model to find all users in the database
 * and sends the response with the users.
 * It also handles pagination.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getAllUsers = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = await User.countDocuments();

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    const users = await User.find({}).skip(startIndex).limit(limit).sort({ createdAt: -1 });
    if (!users) {
        return next(new NotFoundError('Users not found'));
    }
    res.status(StatusCodes.OK).json({ count: users.length, total, pagination, users });
};
/**
 * Controller to delete a user
 * This function handles the request to delete a user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>} A Promise that resolves to the response sent
 */
const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return next(new NotFoundError(`User with id ${userId} not found`));
    }
    res.status(StatusCodes.OK).json({ user });
};
module.exports = {
    getAllUsers,
    deleteUser,
};