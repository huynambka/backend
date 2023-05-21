const { StatusCodes } = require('http-status-codes');
const { NotFoundError, CreateResourceError } = require('../errors');
const Post = require('../models/Post.model');

/**
 * Controller to get all posts
 * This function handles the request to get all posts.
 * It uses the Post model to find all posts in the database
 * and sends the response with the posts.
 * It also handles pagination.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getAllPosts = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const sort = {};
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;

    const total = await Post.countDocuments({});
    if (!total) {
        return next(new NotFoundError('No posts found'));
    }
    const posts = await Post.find({}).sort(sort).skip(startIndex).limit(limit);

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
    res.json({ count: posts.length, total, pagination, posts });
};
/**
 * Controller to get a post by id
 * This function handles the request to get a post by id.
 * It uses the Post model to find a post in the database
 * and sends the response with the post.
 * It also handles the case where the post is not found.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getPostById = async (req, res, next) => {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
        return next(new NotFoundError(`No post with id: ${postId} found`));
    }
    res.json({ post });
};
/**
 * Controller to create a new post
 * This function handles the request to create a new post.
 * It uses the Post model to create a new post in the database
 * and sends the response with the newly created post.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const createNewPost = async (req, res, next) => {
    const post = {
        ...req.body,
    };
    const createdPost = await Post.create(post);
    if (!createdPost) {
        return next(new CreateResourceError('Some thing went wrong while creating post'));
    }
    res.status(StatusCodes.CREATED).json({ post });
};
/**
 * Controller to update a post
 * This function handles the request to update a post.
 * It uses the Post model to update a post in the database
 * and sends the response with the updated post.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const updatePost = async (req, res, next) => {
    const postId = req.params.id;
    const updatedPost = {
        ...req.body,
    };
    const post = await Post.findByIdAndUpdate(postId, updatedPost, { new: true });
    if (!post) {
        return next(new NotFoundError(`No post with id: ${postId} found`));
    }
    res.status(StatusCodes.OK).json({ post });
};
/**
 * Controller to delete a post
 * This function handles the request to delete a post.
 * It uses the Post model to delete a post in the database
 * and sends the response with the message.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const deletePost = async (req, res, next) => {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
        return next(new NotFoundError(`No post with id: ${postId} found`));
    }
    res.status(StatusCodes.OK).json({ msg: 'Post deleted successfully' });
};
/**
 * Controller to get all comments of a post
 * This function handles the request to get all comments of a post.
 * It uses the Post model to find a post in the database
 * and sends the response with the comments.
 * It also handles pagination.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getAllCommentsOfPost = async (req, res, next) => {
    const postId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Post.findById(postId).countDocuments('post_comments');
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
    const post = await Post.findById(postId).select('post_comments').skip(startIndex).limit(limit).sort({ createdAt: -1 });
    if (!post) {
        return next(new NotFoundError(`No post with id: ${postId} found`));
    }
    const comments = Object.values(post.post_comments);
    res.status(StatusCodes.OK).json({
        count: comments.length,
        total,
        pagination,
        comments,
    });

};
/**
 * Controller to update a comment of a post
 * This function handles the request to update a comment of a post.
 * It uses the Post model to find a post in the database
 * and sends the response with the updated comment.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updatePostComments = async (req, res) => {
    const postId = req.params.postId;
    const newCommentId = req.newComment.id;
    // If the request is a POST request, add the new comment to the post_comments array
    if (req.method === 'POST') {
        const { comments_amount } = await Post.findById(postId).select('comments_amount');
        const { post_comments } = await Post.findById(postId).select('post_comments');
        post_comments.push(newCommentId);
        const post = await Post.findByIdAndUpdate(postId, {
            comments_amount: comments_amount + 1, // Increase comments_amount by 1
            post_comments: post_comments, // Add newCommentId to post_comments
        }, { new: true });
        res.status(StatusCodes.OK).json({ post });
    }
    // If the request is a DELETE request, remove the deleted comment from the post_comments array
    if (req.method === 'DELETE') {
        const deletedCommentId = req.params.id;
        const { comments_amount } = await Post.findById(postId).select('comments_amount');
        const { post_comments } = await Post.findById(postId).select('post_comments');
        post_comments.slice(post_comments.indexOf(deletedCommentId), 1);
        const post = await Post.findByIdAndUpdate(postId, {
            comments_amount: comments_amount - 1, // Decrease comments_amount by 1
            post_comments: post_comments, // Remove deletedCommentId from post_comments
        }, { new: true });
        res.status(StatusCodes.OK).json({ post });
    }
};
const likePost = async (req, res, next) => {
    const postId = req.params.id;
    const { likes_amount } = await Post.findById(postId).select('likes_amount');
    console.log(likes_amount);
    const post = await Post.findByIdAndUpdate(postId, {
        likes_amount: likes_amount + 1, // Increase likes_amount by 1
    }, { new: true });
    if (!post) {
        return next(new NotFoundError(`No post with id: ${postId} found`));
    }
    res.status(StatusCodes.OK).json({ post });
};
module.exports = {
    getAllPosts,
    getPostById,
    createNewPost,
    updatePost,
    deletePost,
    updatePostComments,
    getAllCommentsOfPost,
    likePost,
};
