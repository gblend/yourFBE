const { createJWT, isTokenValid, decodeCookies, attachCookiesToResponse } = require('./jwt');
const { createTokenUser } = require('./createTokenUser');
const { checkPermissions } = require('./checkPermissions');
const {sendVerificationEmail, sendResetPasswordEmail} = require('./email/sendEmail');
const {formatValidationError} = require('./formatJoiValidationError');
const {constants} = require('./constant');
const {adaptRequest} = require('./adaptRequest');
const createHash = require('./createHash');
const {capitalizeFirstCharacter} = require('./capitalizeFirstCharacter');
const {logger} = require('./logger');

module.exports = {
    createJWT,
    isTokenValid,
    decodeCookies,
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
    formatValidationError,
    adaptRequest,
    constants,
    capitalizeFirstCharacter,
    logger,
}
