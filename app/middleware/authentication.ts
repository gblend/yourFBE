import {UnauthenticatedError, UnauthorizedError} from '../lib/errors';
import {
    adaptRequest,
    attachCookiesToResponse,
    constants,
    createJWT,
    isTokenValid,
    logger,
    StatusCodes
} from '../lib/utils';
import {Token} from '../models';
import {NextFunction, Request, Response} from '../types/index';
import {ITokenUser} from '../interface';

const authenticateUser = async (req: Request | any, res: Response, next: NextFunction) => {
    const {signedCookies, headers: {authorization, authorization_refresh}, path, method} = adaptRequest(req);
    let {accessToken, refreshToken} = signedCookies;

    try {
        if (!accessToken && authorization && authorization.startsWith('Bearer')) {// check request header for bearer token
            accessToken = authorization.split(' ')[1];
        }

        if (!refreshToken && authorization_refresh && authorization_refresh.startsWith('BearerRefresh')) {
            refreshToken = authorization_refresh.split(' ')[1];
        }

        if (accessToken) {
            const {name, id, role}: ITokenUser = isTokenValid(accessToken);
            req.user = {name, id, role};
            return next();
        } else if (refreshToken) {
            const payload: {user: ITokenUser, refreshToken: string} = isTokenValid(refreshToken);
            const isTokenExist = await Token.findOne({
                user: payload.user.id,
                refreshToken: payload.refreshToken
            });

            if (!isTokenExist || !isTokenExist?.isValid) {
                logger.info(`${StatusCodes.UNAUTHORIZED} - Refresh token invalid - ${method} ${path}`)
                res.status(StatusCodes.UNAUTHORIZED).json({message: constants.auth.AUTHENTICATION_INVALID})
            }

            const accessTokenJWT = createJWT(payload.user);
            attachCookiesToResponse({accessTokenJWT, refreshTokenJWT: isTokenExist!.refreshToken, res});
            req.user = payload.user;
            return next();
        }

        return next(new UnauthenticatedError(constants.auth.AUTHENTICATION_INVALID))
    } catch (err: any) {
        logger.info(`Authentication error: ${err.message} - ${method} ${path}`)
        throw new UnauthenticatedError('Authentication failed, please try again');
    }
}

const authorizeRoles = (...roles: string[]) => {
    return (req: Request, _: Response, next: NextFunction) => {
        const {user, method, path}: { user: any, method: string, path: string } = adaptRequest(req);
        if (!roles.includes(user!.role)) {
            logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access error - ${method} ${path}`)
            throw new UnauthorizedError('You are not authorized to access this resource');
        }
        next();
    }
}

export {
    authenticateUser,
    authorizeRoles
}
