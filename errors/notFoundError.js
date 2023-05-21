const { StatusCodes } = require('http-status-codes');

/**
 * Error thrown when a resource is not found.
 */
class NotFoundError extends Error {
    constructor(message = 'Not Found') {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;