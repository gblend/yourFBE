import jwt from 'jsonwebtoken';
import {config} from '../../config/config';
import {adaptRequest} from './adapt_request';
import {Request, Response, NextFunction } from '../../types/index';
import {IRefreshTokenUser, ITokenUser} from '../../interface';

const createJWT = (payload: ITokenUser | IRefreshTokenUser) => {
    return jwt.sign(payload, config.jwt.secret);
}

const isTokenValid = (token: string): any => jwt.verify(token, config.jwt.secret);

const attachCookiesToResponse = ({accessTokenJWT, refreshTokenJWT, res}:
                                     {accessTokenJWT: string, refreshTokenJWT: string | null, res: Response}): void => {
    res.cookie('accessToken', accessTokenJWT,
        {
            httpOnly: true,
            secure: config.app.env === 'production',
            signed: true,
            expires: new Date(Date.now() + config.days.one),
        });
    res.cookie('refreshToken', refreshTokenJWT,
        {
            expires: new Date(Date.now() + config.days.thirty),
            httpOnly: true,
            secure: config.app.env === 'production',
            signed: true
        });
}

const decodeCookies = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    const {signedCookies, cookies} = adaptRequest(req);
    const {token} = signedCookies || cookies;
    req.user = jwt.decode(token)!;

    return next();
}

export {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    decodeCookies
}
