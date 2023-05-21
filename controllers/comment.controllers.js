const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const { StatusCodes } = require('http-status-codes');
const { CreateResourceError, NotFoundError, UnauthenticatedError } = require('../errors');

// TODO: Implement get comments by id
const getCommentById = async (req, res) => {
    res.send('Get Comment By Id');
};

/**
 * Controller to create a comment
 * This function handles the creation of a new comment.
 * It uses the Comment model to create a new comment in the database
 * and sends the response with the comment.
 * Then it calls the next middleware to update the post with the new comment.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createComment = async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
        return next(new NotFoundError(`No post with id: ${postId} found`));
    }
    const author_id = req.user.userId;
    const { content } = req.body;
    req.newComment = await Comment.create({ content, author_id, post_id: postId });
    if (!req.newComment) {
        return next(new CreateResourceError('Something went wrong while creating comment'));
    }
    next();
};
/**
 * Controller to delete a comment
 * This function handles the request to delete a comment.
 * It uses the Comment model to delete a comment in the database
 * and sends the response with the comment.
 * Then it calls the next middleware to update the post with the new comment.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deleteComment = async (req, res, next) => {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const commentId = req.params.id;
    const comment = Comment.findById(commentId);
    if (!comment) {
        return next(new NotFoundError(`No comment with id: ${commentId} found`));
    } else if (comment.author_id.valueOf() !== userId.valueOf() !== 'admin') {
        return next(new UnauthenticatedError('You are not authorized to delete this comment'));
    }
    await Comment.deleteOne({ _id: commentId });
    next();
};
/**
 * Controller to update a comment
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updateComment = async (req, res, next) => {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return next(new NotFoundError(`No comment with id: ${commentId} found`));
    } else if (comment.author_id.valueOf() !== userId.valueOf() && user.role !== 'admin') {
        return next(new UnauthenticatedError('You are not authorized to change this comment'));
    }
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    res.status(StatusCodes.OK).json({ updatedComment });
};
module.exports = {
    getCommentById,
    createComment,
    deleteComment,
    updateComment,
};
