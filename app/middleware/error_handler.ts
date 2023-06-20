import {StatusCodes} from 'http-status-codes';
import {adaptRequest, logger} from '../lib/utils';
import {NextFunction, Request, Response} from '../types/index';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const {path, method} = adaptRequest(req);

    const customError = {
        // set defaults
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong. Please try again later.',
    };

    if (err.message.indexOf('already in use') != -1) {
        customError.message = err.message;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item: any) => item.message)
            .join(',');
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value.`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name === 'CastError') {
        customError.message = `No resource found with id: ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }

    logger.error(`${customError.statusCode} - ${customError.message} - ${method} ${path}`);
    return res.status(customError.statusCode).json({
        data: {
            errors: [customError.message],
        }
    });
};
