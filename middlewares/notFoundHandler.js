const { StatusCodes } = require('http-status-codes');
/**
 * Middleware to handle not found routes
 * @param req
 * @param res
 * @param next
 */
const notFoundHandler = (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ error: 'No route found' });
};
module.exports = notFoundHandler;