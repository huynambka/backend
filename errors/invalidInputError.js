const { StatusCodes } = require('http-status-codes');

/**
 * Error handler middleware for invalid input errors
 */
class InvalidInputError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.message = message;
    }
}

module.exports = InvalidInputError;