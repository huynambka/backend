/**
 This file defines the Express router for handling authentication routes.
 It creates the authRouter instance using the Express framework.
 Dependencies:
 express: The Express module for creating the router.
 Controllers:
 register: Controller function for user registration.
 login: Controller function for user login.
 Routes:
 POST /register: Route for user registration.
 POST /login: Route for user login.
 @module authRouter
 @requires express
 @requires ../controllers/auth.controllers
 */
const express = require('express');
const passport = require('../config/passport');
const { createComment, deleteComment, updateComment } = require('../controllers/comment.controllers');
const { updatePostComments } = require('../controllers/post.controllers');
const commentRouter = express.Router();

const passportJWT = passport.authenticate('jwt', { session: false }, null);

/**
 Route for creating a new comment and updating the post's comments.
 @name POST /:postId
 @function
 @memberof module:commentRouter
 @inner
 @param {string} path - Express route path with parameter
 @param {function} middleware - Passport authentication middleware
 @param {function} controller - Controller function to handle the route
 @param {function} updatePostComments - Controller function to update post's comments
 */
commentRouter.post('/:postId', passportJWT, createComment, updatePostComments);

/**
 Route for deleting a comment and updating the post's comments.
 @name DELETE /:id
 @function
 @memberof module:commentRouter
 @inner
 @param {string} path - Express route path with parameter
 @param {function} middleware - Passport authentication middleware
 @param {function} controller - Controller function to handle the route
 @param {function} updatePostComments - Controller function to update post's comments
 */
commentRouter.delete('/:id', passportJWT, deleteComment, updatePostComments);

commentRouter.put('/:id', passportJWT, updateComment);
module.exports = commentRouter;
