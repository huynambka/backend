require('express-async-errors');
require('dotenv').config();
const express = require('express');
// Import routes
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
// Import middlewares
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

const passport = require('./config/passport');
// Create express instance
const app = express();
// Middleware
app.use(passport.initialize());
app.use(express.json());
// Passport middleware
// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
// Home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Error handler
app.use(errorHandler);
app.use(notFoundHandler);
// Start server
const { MONGO_URI } = require('./config/database');
const connectDB = require('./db/connect');
const start = async () => {
    try {
        // Connect to DB
        await connectDB(MONGO_URI);
        // Start server
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server started on port ${process.env.PORT || 3000}`);
        });
    } catch (err) {
        console.log(err);
    }
};
start();
