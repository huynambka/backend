const { StatusCodes } = require('http-status-codes');

/**
 * Error handler middleware for unauthenticated errors.
 */
class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.status = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;