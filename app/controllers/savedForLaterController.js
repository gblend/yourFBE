'use strict';

const {StatusCodes} = require('http-status-codes');
const {SavedForLater, validateSavedForLaterDto} = require('../models/SavedForLater');
const {config} = require('../config/config');
const mongoose = require('mongoose');
const {BadRequestError, NotFoundError} = require('../lib/errors');
const {saveActivityLog} = require('../lib/dbActivityLog');
const {
	adaptRequest,
	logger,
	formatValidationError,
	redisRefreshCache,
	redisGetBatchRecords,
	redisSetBatchRecords,
	paginate, createObjectId
} = require('../lib/utils');

const savePostForLater = async (req, res) => {
	const {body, method, path, user: {id: userId}} = adaptRequest(req);
	body.user = createObjectId(userId);
	body.feed = createObjectId(body.feed);
	const {error} = validateSavedForLaterDto(body);

	if (error) {
		logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
		return res.status(StatusCodes.BAD_REQUEST)
			.json({data: {errors: formatValidationError(error)}});
	}

	const savedPost = await SavedForLater.create(body);
	if (savedPost) {
		await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${savedPost._id}`, [savedPost]);
		logger.info(`${StatusCodes.OK} - Post saved for later - ${method} ${path}`);
	}

	res.status(StatusCodes.OK).json({ message: 'Post successfully saved for later.', data: { savedForLater: savedPost } });
}

module.exports = {
	savePostForLater,
}
