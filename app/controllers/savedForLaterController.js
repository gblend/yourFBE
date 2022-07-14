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
	adaptPaginateParams,
	mapPaginatedData,
	paginate,
	createObjectId
} = require('../lib/utils');
const {userNamespaceIo} = require('../socket');

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

	const isSavedForLater = await SavedForLater.findOne(body);
	let savedPost = {}
	if (!isSavedForLater) {
		savedPost = await SavedForLater.create(body);
		if (!Object.keys(savedPost).length) {
			throw new BadRequestError(`Unable to save post for later. Please try again later.`);
		}
		await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${savedPost._id}`, [savedPost]);
		logger.info(`${StatusCodes.OK} - Post saved for later - ${method} ${path}`);
	}

	userNamespaceIo.to('savedForLater').volatile.emit('admin:post_starred', {post: savedPost, userId});
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
	userNamespaceIo.to('savedForLater').volatile.emit('admin:post_deleted', {post: deleted, userId});
	res.status(StatusCodes.OK).json({ message: 'Post saved for later successfully removed.'});
}

const getPostsSavedForLater = async (req, res) => {
	const {user: {id: userId}, path, method, queryParams: {pageSize, pageNumber}} = adaptRequest(req);

	let savedPosts = await redisGetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}`);
	if (savedPosts && savedPosts.length > 0) {
		logger.info(`${StatusCodes.OK} - Posts saved for later retrieved from cache - ${method} ${path}`);
		let {pagination:_pagination, result: _result} = await paginate(savedPosts, {pageSize, pageNumber});

		return res.status(StatusCodes.OK).json({
			data: {
				savedForLater: _result,
				pagination: _pagination,
			}
		});
	}

	savedPosts = SavedForLater.find({user: createObjectId(userId), status: {$nin: ['disabled']}}).populate('feed', '_id title url logoUrl', 'Feed');
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

const getPostSavedForLater = async (req, res) => {
	const {user: {id: userId}, path, method, pathParams: {id: postId}} = adaptRequest(req);
	if (!postId) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid post saved for later id: ${postId} - ${method} ${path}`);
		throw new BadRequestError('Invalid post saved for later id');
	}

	let post = await redisGetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${postId}`);
	if (post.length < 1) {
		post = await SavedForLater.findOne({_id: postId, status: {$nin: ['disabled']}}).populate('feed', '_id title url logoUrl', 'Feed');
		if (!post) {
			throw new NotFoundError('Post saved for later not found.');
		}
		await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${post._id}`, [post]);
	}

	return res.status(StatusCodes.OK).json({
		message: 'Post saved for later retrieved successfully.',
		data: {
			savedForLater: post,
		}
	});
}

const markPostSavedForLaterAsRead = async (req, res) => {
	const {pathParams: {id: postId}, method, path, user: {id: userId}} = adaptRequest(req);

	if (!postId || !mongoose.isValidObjectId(postId)) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid post saved for later id: ${postId} - ${method} ${path}`);
		throw new BadRequestError('Invalid post saved for later id.');
	}

	const post = await SavedForLater.findOneAndUpdate({_id: postId}, {status: 'read'}, {runValidators: true, new: true});
	if (post){
		await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${postId}`, [post]);
		logger.info(`${StatusCodes.OK} - Post saved for later marked as read - ${method} ${path}`);
		return res.status(StatusCodes.OK).json({ message: 'Post saved for later successfully marked as read.', data: { postData: post } });
	}

	res.status(StatusCodes.NOT_FOUND).json({message: 'Post saved for later not found.'});
}

const userStarredFeedPostsStats = async (req, res) => {
	const {user: {id: userId}, path, method, queryParams: {pageSize: _pageSize, pageNumber: _pageNumber}} = adaptRequest(req);
	const {pageSize, pageNumber, offset} = adaptPaginateParams(_pageSize, _pageNumber);

	const starredFeedPostsStat = await SavedForLater.aggregate([
		{
			$match: {status: {$nin: ['disabled']}, user: createObjectId(userId)}
		},
		{
			$lookup: {from: 'feeds', localField: 'feed', foreignField: '_id', as: 'feed'}
		},
		{
			$unwind: '$feed',
		},
		{
			$group: {
				_id: '$feed._id',
				postsCount: {$sum: 1},
				feed: {$first: '$$ROOT'},
			}
		},
		{
			$replaceRoot: {
				newRoot: {
					$mergeObjects: ['$feed', { postsCount: '$postsCount' }]
				}
			}
		},
		{
			$sort: {
				postsCount: -1
			}
		},
		{
			$facet: {
				paginatedResults: [{$skip: offset}, {$limit: pageSize}],
				feeds: [
					{
						$count: 'count'
					}
				]
			}
		},
	]);

	if (starredFeedPostsStat.length === 0) {
		logger.info(`${StatusCodes.NOT_FOUND} - No user starred feed posts found - ${method} ${path}`);
		throw new NotFoundError('No user starred feed posts found');
	}
	const {result, total, pages, next, previous} = mapPaginatedData(starredFeedPostsStat, _pageSize, _pageNumber);

	logger.info(`${StatusCodes.OK} - User starred feed posts stats fetched successfully - ${method} ${path}`);
	res.status(StatusCodes.OK).json({
		message: 'User starred feed posts stats fetched successfully.',
		data: {
			starredFeedPostsStat: result,
			pagination: {
				pageSize,
				pageNumber,
				offset,
				total,
				pages,
				previous,
				next,
			}
		}
	});
}

const allStarredFeedPostsStats = async (req, res) => {
	let {path, method, queryParams: {pageSize: _pageSize, pageNumber: _pageNumber}} = adaptRequest(req);
	const {pageSize, pageNumber, offset} = adaptPaginateParams(_pageSize, _pageNumber);

	const starredFeedPostsStats = await SavedForLater.aggregate([
		{
			$match: {status: {$nin: ['disabled']}}
		},
		{
			$lookup: {from: 'feeds', localField: 'feed', foreignField: '_id', as: 'feed'}
		},
		{
			$unwind: '$feed',
		},
		{
			$group: {
				_id: '$feed._id',
				postsCount: {$sum: 1},
				feed: {$first: '$$ROOT'},
			}
		},
		{
			$replaceRoot: {
				newRoot: {
					$mergeObjects: ['$feed', { postsCount: '$postsCount' }]
				}
			}
		},
		{
			$sort: {
				postsCount: -1
			}
		},
		{
			$facet: {
				paginatedResults: [{$skip: offset}, {$limit: pageSize}],
				feeds: [
					{
						$count: 'count'
					}
				]
			}
		},
	]);

	if (starredFeedPostsStats.length === 0) {
		logger.info(`${StatusCodes.NOT_FOUND} - No starred feed posts found - ${method} ${path}`);
		throw new NotFoundError('No starred feed posts found');
	}
	const {result, total, pages, next, previous} = mapPaginatedData(starredFeedPostsStats, _pageSize, _pageNumber);

	logger.info(`${StatusCodes.OK} - All starred feed posts stats fetched successfully - ${method} ${path}`);
	res.status(StatusCodes.OK).json({
		message: 'All starred feed posts stats fetched successfully.',
		data: {
			starredFeedPostsStats: result,
			pagination: {
				pageSize,
				pageNumber,
				offset,
				total,
				pages,
				previous,
				next,
			}
		}
	});
}

module.exports = {
	savePostForLater,
	getPostsSavedForLater,
	getPostSavedForLater,
	deletePostSavedForLater,
	userStarredFeedPostsStats,
	allStarredFeedPostsStats,
	markPostSavedForLaterAsRead
}
