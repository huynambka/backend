const { StatusCodes } = require('http-status-codes');

/**
 * Error handler middleware
 * @param err
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const errorHandler = (err, req, res, next) => {
    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong try again later',
    };
    // Mongoose bad ObjectId
    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(', ');
        customError.statusCode = 400;
    }
    // Mongoose duplicate key
    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue,
        )} field, please choose another value`;
        customError.statusCode = 400;
    }
    //
    if (err.name === 'CastError') {
        customError.message = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    // JWT errors
    if (err.name === 'UnauthenticatedError') {
        customError.message = 'Unauthenticated';
        customError.statusCode = StatusCodes.UNAUTHORIZED;
    }
    return res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = errorHandler;