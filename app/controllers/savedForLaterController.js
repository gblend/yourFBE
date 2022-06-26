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

const deletePostSavedForLater = async (req, res) => {
	const {pathParams: {id: postId}, method, path, user: {id: userId, role}} = adaptRequest(req);
	if (!postId || !mongoose.isValidObjectId(postId)) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid post id: ${postId} - ${method} ${path}`);
		throw new BadRequestError('Invalid post id.');
	}

	const deleted = await SavedForLater.findOneAndDelete({_id: postId, user: userId});
	if(!deleted) {
		throw new NotFoundError('Post saved for later not found.')
	}
	await redisRefreshCache(`${config.cache.savePostForLaterCacheKey}_${userId}_${postId}`);

	const logData = {
		action: `deletePostSavedForLater: ${postId} - by ${role}`,
		resourceName: 'saveForLater',
		user: createObjectId(userId),
	}
	await saveActivityLog(logData, method, path);
	res.status(StatusCodes.OK).json({ message: 'Post saved for later successfully removed.'});
}

const getPostsSavedForLater = async (req, res) => {
	const {user: {id: userId}, path, method, queryParams: {pageSize, pageNumber}} = adaptRequest(req);

	let savedPosts = await redisGetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}`);
	if (savedPosts && savedPosts.length > 0) {
		logger.info(`${StatusCodes.OK} - Posts saved for later retrieved from cache - ${method} ${path}`);
		let {pagination, result} = await paginate(savedPosts, {pageSize, pageNumber});

		return res.status(StatusCodes.OK).json({
			data: {
				savedForLater: result,
				pagination,
			}
		});
	}

	savedPosts = SavedForLater.find({user: createObjectId(userId), status: {$nin: ['disabled']}});
	const {pagination, result} = await paginate(savedPosts, {pageSize, pageNumber});
	const savedPostsData = await result;

	if (!savedPostsData || savedPostsData.length < 1) {
		return res.status(StatusCodes.NOT_FOUND).json({message: 'No saved posts found.'});
	}

	await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}`, savedPostsData);
	return res.status(StatusCodes.OK).json({
		data: {
			savedForLater: savedPostsData,
			pagination,
		}
	});
}

module.exports = {
	savePostForLater,
	getPostsSavedForLater,
	deletePostSavedForLater,
}
