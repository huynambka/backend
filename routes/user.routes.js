const express = require('express');
const userRouter = express.Router();
const passport = require('../config/passport');
const {
    getUserById,
    updateUserProfile,
    getAllSavedPosts,
    updateSavedPost,
} = require('../controllers/user.controllers');
const passportJWT = passport.authenticate('jwt', { session: false }, null);

// Routes
userRouter.get('/:id/profile', getUserById);
userRouter.put('/:id', passportJWT, updateUserProfile);
userRouter.get('/:id/saved-posts', passportJWT, getAllSavedPosts);
userRouter.put('/:id/saved-post', passportJWT, updateSavedPost);
module.exports = userRouter;