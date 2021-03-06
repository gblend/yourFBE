'use strict';

const {createJWT, isTokenValid, decodeCookies, attachCookiesToResponse} = require('./jwt');
const {createTokenUser} = require('./createTokenUser');
const {checkPermissions} = require('./checkPermissions');
const {sendVerificationEmail, sendResetPasswordEmail} = require('./email/sendEmail');
const {formatValidationError} = require('./formatJoiValidationError');
const {constants} = require('./constant');
const {adaptRequest} = require('./adaptRequest');
const createHash = require('./createHash');
const {capitalizeFirstCharacter} = require('./capitalizeFirstCharacter');
const {logger} = require('./logger');
const {appStatus} = require('./appStatus');
const {paginate} = require('./pagination');
const StatusCodes = () => require('http-status-codes').StatusCodes;
const {generateToken} = require('./verificationToken');
const {redisRefreshCache, redisSetBatchRecords, redisGetBatchRecords} = require('./redis');
const {appRoutes} = require('./registeredRoutes');
const {createObjectId} = require('./createObjectIdType');

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
	appStatus,
	StatusCodes: StatusCodes(),
	paginate,
	generateToken,
	redisRefreshCache,
	redisSetBatchRecords,
	redisGetBatchRecords,
	appRoutes,
	createObjectId,
}
