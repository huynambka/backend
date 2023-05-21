const { StatusCodes } = require('http-status-codes');

const User = require('../models/User.model');
const { NotFoundError, CreateResourceError } = require('../errors');


/**
 * Controller to get user by id
 * This function handles the request to get a user by id.
 * It uses the User model to find a user in the database
 * and sends the response with the user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new NotFoundError(`No user with id: ${userId} found`));
    }
    user.password = undefined;
    user.role = undefined;

    res.status(StatusCodes.OK).json({ user });
};
/* TODO: Implement getUserByUsername
const getUserByUsername = async (req, res, next) => {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
        return next(new NotFoundError(`No user with username: ${username} found`));
    }
    res.status(StatusCodes.OK).json({ user });
};
*/

/**
 * Controller to update user
 * This function handles the request to update a user.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateUserProfile = async (req, res, next) => {
    const userId = req.params.id;
    const updatedUser = { ...req.body };
    // Prevent user from updating role to admin
    if (updatedUser.role === 'admin') {
        return next(new CreateResourceError('You cannot update your role to admin'));
    }
    const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    if (!user) {
        return next(new NotFoundError(`No user with id: ${userId} found`));
    }
    user.password = undefined;
    res.status(StatusCodes.OK).json({ user });
};

/**
 * Controller to get all saved posts of user
 * This function handles the request to get all saved posts of user.
 * It also handles the case where no saved posts are found.
 * It also handles the pagination of the saved posts.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getAllSavedPosts = async (req, res, next) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.findById(userId).countDocuments('saved_posts');
    const { saved_posts } = await User.findById(userId).select('saved_posts').skip(startIndex).limit(limit).sort({ createdAt: -1 });
    if (!saved_posts) {
        return next(new NotFoundError(`No saved posts found`));
    }
    const pagination = {};
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
    res.status(StatusCodes.OK).json({ count: saved_posts.length, total, pagination, saved_posts });
};
/**
 * Controller to add saved post to user
 * It also handles the case where no user is found.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateSavedPost = async (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.params.id;
    const action = req.query.action;
    if (action === 'add') {
        const user = await User.findByIdAndUpdate(userId, { $addToSet: { saved_posts: postId } }, { new: true });
        if (!user) {
            return next(new NotFoundError(`No user with id: ${userId} found`));
        }
        return res.status(StatusCodes.OK).json({ saved_posts: user.saved_posts });
    }
    if (action === 'remove') {
        const user = await User.findByIdAndUpdate(userId, { $pull: { saved_posts: postId } }, { new: true });
        if (!user) {
            return next(new NotFoundError(`No user with id: ${userId} found`));
        }
        res.status(StatusCodes.OK).json({ saved_posts: user.saved_posts });
    }
};


module.exports = {
    getUserById,
    // getUserByUsername,
    updateUserProfile,
    getAllSavedPosts,
    updateSavedPost,
};