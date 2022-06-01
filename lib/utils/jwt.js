'use strict';

const jwt = require('jsonwebtoken');
const {config} = require('../../config/config');
const {adaptRequest} = require('./adaptRequest');

const createJWT = (payload) => {
    return jwt.sign(payload, config.jwt.secret);
}

const isTokenValid = (token) => jwt.verify(token, config.jwt.secret);

const attachCookiesToResponse = ({accessTokenJWT, refreshTokenJWT, res}) => {
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

const decodeCookies = async (req, _res, next) => {
    const {signedCookies, cookies} = adaptRequest(req);
    const {token} = signedCookies || cookies;
    req.user = await jwt.decode(token);

    next();
}

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    decodeCookies
}
