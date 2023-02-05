import {UnauthorizedError, UnauthenticatedError} from '../lib/errors';
import {Request, Response, NextFunction} from '../types/index';
import {adaptRequest, logger, constants, StatusCodes, isTokenValid} from '../lib/utils';

const authenticateUser = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const {headers: {authorization}, cookies, method, path} = adaptRequest(req);
    let token;
    // check request header for bearer token
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }
    // check cookies
    else if (cookies.token) {
        token = cookies.token;
    }

    if (!token) {
        logger.info(`${StatusCodes.UNAUTHORIZED} - Authentication error - ${method} ${path}`)
        throw new UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
    }
    try {
        const payload = isTokenValid(token);

        // attach the user and user's role to the req object
        req.user = {
            userId: payload.user.userId,
            role: payload.user.role,
        };

        next();
    } catch (error: any) {
        logger.info(`${error.statusCode} - Authentication invalid: ${error.message} - ${method} ${path}`)
        throw new UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
    }
};

const authorizeRoles = (...roles: string[]): Function => {
    return (req: Request, _: Response, next: NextFunction) => {
        const {method, path, user}: {method: string, path: string, user: any} = adaptRequest(req);

        if (!roles.includes(user.role)) {
            logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access error - ${method} ${path}`)
            throw new UnauthorizedError(
                'Unauthorized to access this route'
            );
        }
        next();
    };
};

export {
    authenticateUser,
    authorizeRoles
}
