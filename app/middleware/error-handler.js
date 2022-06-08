const {StatusCodes} = require('http-status-codes');
const {logger, adaptRequest} = require('../lib/utils');

const errorHandlerMiddleware = (err, req, res, _next) => {
    const {path, method} = adaptRequest(req);

    let customError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong try again later.',
    };

    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        customError.statusCode = 400;
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value.`;
        customError.statusCode = 400;
    }

    if (err.name === 'CastError') {
        customError.message = `No resource found with id: ${err.value}`;
        customError.statusCode = 404;
    }

    logger.error(`${customError.statusCode} - ${customError.message} - ${method} ${path}`);
    return res.status(customError.statusCode).json({status: customError.statusCode, message: customError.message});
};

module.exports = errorHandlerMiddleware;
