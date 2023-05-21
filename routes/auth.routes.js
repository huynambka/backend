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
const authRouter = express.Router();
const { register, login } = require('../controllers/auth.controllers');

/**
 Route for user registration.
 @name POST /register
 @function
 @memberof module:authRouter
 @inner
 @param {string} path - Express route path
 @param {function} controller - Controller function to handle the route
 */
authRouter.post('/register', register);

/**
 Route for user login.
 @name POST /login
 @function
 @memberof module:authRouter
 @inner
 @param {string} path - Express route path
 @param {function} controller - Controller function to handle the route
 */
authRouter.post('/login', login);

module.exports = authRouter;