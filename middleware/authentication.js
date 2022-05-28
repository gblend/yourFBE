const CustomErr = require('../lib/errors');
const {isTokenValid, attachCookiesToResponse, adaptRequest, logger, constants, StatusCodes, createJWT} = require('../lib/utils');
const {Token} = require('../models/Token');


const authenticateUser = async (req, res, next) => {
    const {signedCookies, path, method} = adaptRequest(req);
    const {accessToken, refreshToken} = signedCookies;

    try {
        if (accessToken) {
            const {name, id, role} = isTokenValid(accessToken);
            req.user = {name, id, role};
            return next();
        }

        const payload = isTokenValid(refreshToken);
        const isTokenExist = await Token.findOne({
            user: payload.user.id,
            refreshToken: payload.refreshToken
        });
        if (!isTokenExist || !isTokenExist?.isValid) {
            logger.info(`${StatusCodes.BAD_REQUEST} - Access token invalid - ${method} ${path}`)
            throw new CustomErr.UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
        }

        const accessTokenJWT = createJWT(payload.user);
        attachCookiesToResponse({accessTokenJWT, refreshTokenJWT: isTokenExist.refreshToken, res});
        req.user = payload.user;
        next();
    } catch (err) {
        logger.info(`${err.statusCode} - Authentication error: ${err.message} - ${method} ${path}`)
        throw new CustomErr.UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
    }
}

const authorizePermissions = (...roles) => {
    return (req, _res, next) => {
        const {user, method, path} = adaptRequest(req);
        if (!roles.includes(user.role)) {
            logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access error - ${method} ${path}`)
            throw new CustomErr.UnauthorizedError('You are not authorized to access this resource');
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions
}
