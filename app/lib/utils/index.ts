import {createJWT, isTokenValid, decodeCookies, attachCookiesToResponse} from './jwt';
import {createTokenUser} from './create_token_user';
import {checkPermissions} from './check_permission';
import mailer from './email/sendEmail';
import {formatValidationError} from './format_joi_validation_error';
import {constants} from './constant';
import {extractSocketUsers} from './extract_socket_users';
import {adaptRequest} from './adapt_request';
import {createHash, decrypt, encrypt} from './cryptography';
import {capitalizeFirstCharacter} from './capitalize_first_character';
import {logger} from './logger';
import {appStatus} from './app_status';
import {paginate} from './pagination';
import {generateToken} from './verification_token';
import {
	redisRefreshCache,
	redisSetBatchRecords,
	redisGetBatchRecords,
	redisSet,
	redisGet,
	redisDelete,
	redisFlushAll
} from './redis';
import {appRoutes} from './registered_routes';
import {createObjectId} from './create_Objectid_type';
import {mapPaginatedData} from './stats/map_paginated_data';
import {adaptPaginateParams} from './stats/adapt_paginate_params';
import {fetchFeedPosts} from './fetch_feed_posts';
import {StatusCodes} from 'http-status-codes';
const sendVerificationEmail: Function = mailer.sendVerificationEmail;
const sendResetPasswordEmail: Function = mailer.sendResetPasswordEmail;

export {
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
	extractSocketUsers,
	appStatus,
	StatusCodes,
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
