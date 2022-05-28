const CustomError = require('../lib/errors');
const {adaptRequest, logger, constants, StatusCodes, isTokenValid} = require('../lib/utils');

const authenticateUser = async (req, _res, next) => {
    const {headers: {authorization}, cookies, method, path} = adaptRequest(req);
    let token;
    // check header
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }
    // check cookies
    else if (cookies.token) {
        token = cookies.token;
    }

    if (!token) {
        logger.info(`${StatusCodes.UNAUTHORIZED} - Authentication error - ${method} ${path}`)
        throw new CustomError.UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
    }
    try {
        const payload = isTokenValid(token);

        // Attach the user and his permissions to the req object
        req.user = {
            userId: payload.user.userId,
            role: payload.user.role,
        };

        next();
    } catch (error) {
        logger.info(`${error.statusCode} - Authentication invalid: ${error.message} - ${method} ${path}`)
        throw new CustomError.UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
    }
};

const authorizeRoles = (...roles) => {
    return (req, _res, next) => {
        const {method, path, user} = adaptRequest(req);

        if (!roles.includes(user.role)) {
            logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access error - ${method} ${path}`)
            throw new CustomError.UnauthorizedError(
                'Unauthorized to access this route'
            );
        }
        next();
    };
};

module.exports = {authenticateUser, authorizeRoles};
