/**
 * Creates an Express router to handle administrative routes for user management.
 * Utilizes the passport module for authentication and authorization.
 *
 * @module adminRouter
 * @requires express
 * @requires ../config/passport
 * @requires ../controllers/admin.controllers
 */
const express = require('express');
const adminRouter = express.Router();
const passport = require('../config/passport');
const passportAdminJWT = passport.authenticate('admin', { session: false }, null);
const { getAllUsers, deleteUser } = require('../controllers/admin.controllers');
/**
 * Route that retrieves all users.
 * Accessible only to authenticated admin users.
 *
 * @name GET /get-all-users
 * @function
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - Express route path
 * @param {function} middleware - Passport authentication middleware
 * @param {function} controller - Controller function to handle the route
 */
adminRouter.get('/get-all-users', passportAdminJWT, getAllUsers);
/**
 * Route that deletes a user by ID.
 * Accessible only to authenticated admin users.
 *
 * @name DELETE /delete-user/:id
 * @function
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - Express route path with parameter
 * @param {function} middleware - Passport authentication middleware
 * @param {function} controller - Controller function to handle the route
 */
adminRouter.delete('/delete-user/:id', passportAdminJWT, deleteUser);
module.exports = adminRouter;