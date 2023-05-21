/**
 This file defines the Express router for handling post-related routes.
 It creates the postRouter instance using the Express framework.
 Dependencies:
 express: The Express module for creating the router.
 passport: The Passport module for authentication.
 Controllers:
 getAllPosts: Controller function for retrieving all posts.
 createNewPost: Controller function for creating a new post.
 getPostById: Controller function for retrieving a post by ID.
 updatePost: Controller function for updating a post.
 deletePost: Controller function for deleting a post.
 getAllCommentsOfPost: Controller function for retrieving all comments of a post.
 likePost: Controller function for updating likes of a post.
 Routes:
 GET /: Route for retrieving all posts.
 POST /: Route for creating a new post (accessible only to admin users).
 GET /:id: Route for retrieving a post by ID.
 PUT /:id: Route for updating a post (accessible only to admin users).
 DELETE /:id: Route for deleting a post (accessible only to admin users).
 GET /:id/comments: Route for retrieving all comments of a post.
 @module postRouter
 @requires express
 @requires passport
 @requires ../controllers/post.controllers
 */
const express = require('express');
const passport = require('passport');
const {
    getAllPosts,
    createNewPost,
    getPostById,
    updatePost,
    deletePost,
    getAllCommentsOfPost,
    likePost,
    getAllLikesOfPost,
} = require('../controllers/post.controllers');
const passportJWT = passport.authenticate('jwt', { session: false }, null);
const passportAdminJWT = passport.authenticate('admin', { session: false }, null);
const postRouter = express.Router();
// Routes

/**
 * Route for retrieving all posts.
 * @name GET /
 * @function
 * @memberof module:postRouter
 * @inner
 * @param {string} path - Express route path
 * @param {function} controller - Controller function to handle the route
 */
postRouter.get('/', getAllPosts);
/**
 * Route for creating a new post (accessible only to admin users).
 * @name POST /
 * @function
 * @memberof module:postRouter
 * @inner
 * @param {string} path - Express route path
 * @param {function} middleware - Passport authentication middleware
 */
postRouter.post('/', passportAdminJWT, createNewPost);
/**
 * Route for retrieving a post by ID.
 * @name GET /:id
 * @function
 * @memberof module:postRouter
 * @inner
 * @param {string} path - Express route path with parameter
 * @param {function} controller - Controller function to handle the route
 */
postRouter.get('/:id', getPostById);
/** Route for updating a post (accessible only to admin users).
 * @name PUT /:id
 * @function
 * @memberof module:postRouter
 * @inner
 * @param {string} path - Express route path with parameter
 * @param {function} middleware - Passport authentication middleware
 * @param {function} controller - Controller function to handle the route
 */
postRouter.put('/:id', passportAdminJWT, updatePost);
/**
 * Route for deleting a post (accessible only to admin users).
 * @name DELETE /:id
 * @function
 * @memberof module:postRouter
 * @inner
 * @param {string} path - Express route path with parameter
 * @param {function} middleware - Passport authentication middleware
 * @param {function} controller - Controller function to handle the route
 */
postRouter.delete('/:id', passportAdminJWT, deletePost);
/**
 * Route for deleting a post (accessible only to admin users).
 * @name GET /:id/comments
 * @function
 * @memberof module:postRouter
 * @inner
 * @param {string} path - Express route path with parameter
 * @param {function} middleware - Passport authentication middleware
 * @param {function} controller - Controller function to handle the route
 */
postRouter.get('/:id/comments', getAllCommentsOfPost);

/**
 * Route for update likes of a post.
 */
postRouter.post('/:id/like', passportJWT, likePost);

postRouter.get('/:id/likes', getAllLikesOfPost);
module.exports = postRouter;
