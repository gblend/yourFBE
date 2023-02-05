'use strict';

const {createJWT, isTokenValid, decodeCookies, attachCookiesToResponse} = require('./jwt');
const {createTokenUser} = require('./create_token_user');
const {checkPermissions} = require('./check_permission');
const {sendVerificationEmail, sendResetPasswordEmail} = require('./email/sendEmail');
const {formatValidationError} = require('./format_joi_validation_error');
const {constants} = require('./constant');
const {adaptRequest} = require('./adapt_request');
const {createHash, decrypt, encrypt} = require('./cryptography');
const {capitalizeFirstCharacter} = require('./capitalize_first_character');
const {logger} = require('./logger');
const {appStatus} = require('./app_status');
const {paginate} = require('./pagination');
const StatusCodes = () => require('http-status-codes').StatusCodes;
const {generateToken} = require('./verification_token');
const {redisRefreshCache, redisSetBatchRecords, redisGetBatchRecords, redisSet, redisGet, redisDelete, redisFlushAll} = require('./redis');
const {appRoutes} = require('./registered_routes');
const {createObjectId} = require('./create_Objectid_type');
const {mapPaginatedData} = require('./stats/map_paginated_data');
const {adaptPaginateParams} = require('./stats/adapt_paginate_params');
const {fetchFeedPosts} = require('./fetch_feed_posts');

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
	encrypt,
	decrypt,
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
	mapPaginatedData,
	fetchFeedPosts,
	adaptPaginateParams,
	redisSet,
	redisGet,
	redisDelete,
	redisFlushAll
}
