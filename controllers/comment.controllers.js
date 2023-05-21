const Comment = require('../models/Comment.model');
const { StatusCodes } = require('http-status-codes');
const { CreateResourceError, NotFoundError } = require('../errors');

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
    const postId = req.params.post_id;
    const author_id = req.user._id;
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
    const commentId = req.params.id;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
        return next(new NotFoundError(`No comment with id: ${commentId} found`));
    }
    res.status(StatusCodes.OK).json({ msg: 'Comment deleted successfully' });
    next();
};
const updateComment = async (req, res, next) => {
    const commentId = req.params.id;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
    if (!comment) {
        return next(new NotFoundError(`No comment with id: ${commentId} found`));
    }
    res.status(StatusCodes.OK).json({ comment });
};
module.exports = {
    getCommentById,
    createComment,
    deleteComment,
    updateComment,
};
