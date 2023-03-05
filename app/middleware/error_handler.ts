import {StatusCodes} from 'http-status-codes';
import {logger, adaptRequest} from '../lib/utils';
import {Request, Response, NextFunction} from '../types/index';

const errorHandlerMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const {path, method} = adaptRequest(req);

    const customError = {
        // set defaults
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong. Please try again later.',
    };

    if (err.message.indexOf('already in use')) {
        customError.message = err.message;
        customError.statusCode = 400;
    }

    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item: any) => item.message)
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
    return res.status(customError.statusCode).json({
        data: {
            errors: [customError.message],
        }
    });
};

export {
    errorHandlerMiddleware
}
