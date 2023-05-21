const { StatusCodes } = require('http-status-codes');

/**
 * Error thrown when a resource cannot be created
 */
class CreateResourceError extends Error {
    constructor(message = 'Something went wrong while creating resource') {
        super(message);
        this.name = 'CreateResourceError';
        this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    }
}

module.exports = CreateResourceError;