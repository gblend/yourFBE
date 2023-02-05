import {UnauthorizedError, UnauthenticatedError} from '../lib/errors';
import {
    isTokenValid,
    attachCookiesToResponse,
    adaptRequest,
    logger,
    constants,
    StatusCodes,
    createJWT
} from '../lib/utils';
import {Token} from '../models/Token';
import {Request, Response, NextFunction} from '../types/index';
import {ITokenUser} from '../interface';

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const {signedCookies, path, method} = adaptRequest(req);
    const {accessToken, refreshToken} = signedCookies;

    try {
        if (accessToken) {
            const {name, id, role}: ITokenUser = isTokenValid(accessToken);
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
            res.status(StatusCodes.BAD_REQUEST).json({ message: constants.auth.AUTHENTICATION_INVALID})
        }

        const accessTokenJWT = createJWT(payload.user);
        attachCookiesToResponse({accessTokenJWT, refreshTokenJWT: isTokenExist!.refreshToken, res});
        req.user = payload.user;
        next();
    } catch (err: any) {
        logger.info(`${err.statusCode} - Authentication error: ${err.message} - ${method} ${path}`)
        throw new UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID);
    }
}

const authorizePermissions = (...roles: string[]) => {
    return (req: Request, _: Response, next: NextFunction) => {
        const {user, method, path}: {user: any, method: string, path: string} = adaptRequest(req);
        if (!roles.includes(user!.role)) {
            logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access error - ${method} ${path}`)
            throw new UnauthorizedError('You are not authorized to access this resource');
        }
        next();
    }
}

export {
    authenticateUser,
    authorizePermissions
}
