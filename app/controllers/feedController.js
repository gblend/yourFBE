'use strict';

const {StatusCodes} = require('http-status-codes');
const {adaptRequest, logger, formatValidationError, paginate, createObjectId} = require('../lib/utils');
const {validateFeedDto, validateFeedUpdateDto, Feed} = require('../models/Feed');
const {saveActivityLog} = require('../lib/dbActivityLog');
const {BadRequestError, NotFoundError} = require('../lib/errors');
const mongoose = require('mongoose');
const {	io } = require('../socket');

const getFeedsByCategory = async (req, res) => {
	let {path, method, queryParams: {pageSize = 10, pageNumber = 1}} = adaptRequest(req);
	const feedsByCategory = await Feed.aggregate([
		{
			$match: {
				status: 'enabled'
			}
		},
		{
			$lookup: {from: 'feedcategories', localField: 'category', foreignField: '_id', as: 'category'},
		},
		{
			$unwind: '$category',
		},
		{
			$sort: {category: -1}
		},
		{
			$skip: (pageNumber - 1) * pageSize
		},
		{
			$limit: pageSize
		},
		{
			$group: {
				_id: '$category.name',
				count: {$sum: 1},
				feeds: {$push: '$$ROOT'}
			},
		},
		{ $project: {
				_id: 0,
				category: '$_id',
				count: 1,
				feeds: 1,
			}
		}
	]);

	if (feedsByCategory.length < 1) {
		logger.info(`${StatusCodes.NOT_FOUND} - No feed found for get_feeds_by_category - ${method} ${path}`);
		throw new NotFoundError('No feeds found.');
	}

	logger.info(`${StatusCodes.OK} - Feeds by category fetched successfully - ${method} ${path}`);
	return res.status(StatusCodes.OK).json({message: `Feeds by category fetched successfully.`, data: {feedsByCategory}});
}

const getFeedsByCategoryId = async (req, res) => {
	let {path, method, pathParams: {id: categoryId}, user, queryParams: {sort, pageSize, pageNumber, fields}} = adaptRequest(req);
	if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
		throw new BadRequestError('Invalid feed category id.')
	}
	const feeds = Feed.find({category: categoryId, status: 'enabled'});

	if (sort) {
		const sortFields = sort.split(',').join(' ');
		feeds.sort(sortFields);
	}
	if(fields) {
		const requiredFields = fields.split(',').join(' ')
		feeds.select(requiredFields)
	}

	let {pagination, result} = await paginate(feeds, {pageSize, pageNumber});
	const feedsResult = await result;

	const logData = {
		action: `getFeedsByCategoryId: ${categoryId} - by ${user.role}`,
		resourceName: 'feeds',
		user: createObjectId(user.id),
	}
	await saveActivityLog(logData, method, path);

	if (feedsResult.length < 1) {
		logger.info(`${StatusCodes.NOT_FOUND} - No feed found for get_feeds_by_category_id - ${method} ${path}`);
		throw new NotFoundError('No feed found for this category.');
	}
	logger.info(`${StatusCodes.OK} - Feeds with category id ${categoryId} fetched successfully - ${method} ${path}`);
	return res.status(StatusCodes.OK).json({message: `Feeds fetched successfully.`, data: {feeds: feedsResult, pagination}});
}

const createFeed = async (req, res) => {
	const {body, path, method, user} = adaptRequest(req);
	body.user = createObjectId(user.id);
	const {error} = validateFeedDto(body);

	if (error) {
		logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
		return res.status(StatusCodes.BAD_REQUEST).json({data: {errors: formatValidationError(error)}});
	}

	const isFeedExist = await Feed.findOne({url: body.url, title: body.title, category: body.category});
	let feed = {}
	if (!isFeedExist) {
		feed = await Feed.create(body);
		if (!Object.keys(feed).length) {
			throw new BadRequestError(`Unable to follow feed. Please try again later.`);
		}
		const logData = {
			action: `createFeed - by ${user.role}`,
			resourceName: 'Feed',
			user: createObjectId(user.id),
		}
		await saveActivityLog(logData, method, path);
		logger.info(`${StatusCodes.OK} - Feed created - ${method} ${path}`);
	}

	io.to('feeds').emit('feed:created', {feed});
	res.status(StatusCodes.OK).json({message: 'Feed created successfully.', data: {feed}});
}

const getFeeds = async (req, res) => {
	let {path, method, queryParams: {fields, sort, pageSize, pageNumber}} = adaptRequest(req);
	let feeds = Feed.find({status: 'enabled'}).populate('category', '_id name description');

	if (sort) {
		const sortFields = sort.split(',').join(' ');
		feeds.sort(sortFields);
	}
	if (fields) {
		const requiredFields = fields.split(',').join(' ');
		feeds.select(requiredFields);
	}

	let {pagination, result} = await paginate(feeds, {pageSize, pageNumber});
	const feedsResult = await result;

	if (feedsResult.length < 1) {
		logger.info(`${StatusCodes.NOT_FOUND} - No feeds found for get_feeds - ${method} ${path}`);
		throw new NotFoundError('No feed found.');
	}
	logger.info(`${StatusCodes.OK} - Feeds fetched successfully - ${method} ${path}`);
	return res.status(StatusCodes.OK).json({message: 'Feeds fetched successfully.', data: {feeds: feedsResult, pagination}});
}

const getFeedById = async (req, res) => {
	let {path, method, fields: selectFields, pathParams: {id: feedId}} = adaptRequest(req);
	if (!feedId || !mongoose.isValidObjectId(feedId)) {
		throw new BadRequestError('Invalid feed id.');
	}
	let feed = await Feed.findOne({_id: feedId}).populate('category');
	if (!feed) {
		logger.info(`${StatusCodes.NOT_FOUND} - No feed found for get_feed_by_id - ${method} ${path}`);
		throw new NotFoundError(`No feed found with id ${feedId}`);
	}

	if (selectFields) {
		selectFields = selectFields.split(',').join(' ');
		feed.select(selectFields);
	}

	logger.info(`${StatusCodes.OK} - Feed fetched successfully - ${method} ${path}`);
	return res.status(StatusCodes.OK).json({message: 'Feed fetched successfully.', data: {feed}});
}

const deleteFeed = async (req, res) => {
	let {path, method, pathParams: {id: feedId}, user} = adaptRequest(req);
	if (!feedId || !mongoose.isValidObjectId(feedId)) {
		throw new BadRequestError('Invalid feed id.')
	}
	const deletedFeed = await Feed.findOneAndDelete({_id: feedId});
	if (!deletedFeed) {
		throw new BadRequestError('Feed was not deleted. Please check feed id.');
	}

	const logData = {
		action: `deleteFeed: ${feedId} - by ${user.role}`,
		resourceName: 'feeds',
		user: createObjectId(user.id),
	}
	await saveActivityLog(logData, method, path);
	logger.info(`${StatusCodes.OK} - Feed deleted successfully - ${method} ${path}`);

	io.to('feeds').emit('feed:deleted', {feedId});
	return res.status(StatusCodes.OK).json({message: 'Feed deleted successfully.'});
}

const disableFeedById = async (req, res) => {
	let {path, method, pathParams: {id: feedId}, user} = adaptRequest(req);
	if (!feedId || !mongoose.isValidObjectId(feedId)) {
		throw new BadRequestError('Invalid feed id.')
	}
	const feed = await Feed.findOneAndUpdate({_id: feedId}, {status: 'disabled'}, {runValidators: true, new: true});
	if (!feed) {
		throw new BadRequestError('Unable to disable feed. Please check feed id.');
	}
	if (feed.status !== 'disabled') {
		throw new BadRequestError('Unable to disable feed')
	}

	const logData = {
		action: `disableFeed: ${feedId} - by ${user.role}`,
		resourceName: 'feeds',
		user: createObjectId(user.id),
	}
	await saveActivityLog(logData, method, path);
	logger.info(`${StatusCodes.OK} - Feed disabled successfully - ${method} ${path}`);

	io.to('feeds').emit('feed:disabled', {feedId});
	return res.status(StatusCodes.OK).json({message: 'Feed disabled successfully.'});
}

const toggleFeedsStatusByCategoryId = async (req, res) => {
	let {path, method, pathParams: {id: categoryId}, user, queryParams: {status}} = adaptRequest(req);
	if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
		throw new BadRequestError('Invalid feed category id.')
	}
	await Feed.updateMany({category: categoryId}, {status}, {runValidators: true, new: true});

	const logData = {
		action: `disableFeedByCategoryId: ${categoryId} - by ${user.role}`,
		resourceName: 'feeds',
		user: createObjectId(user.id),
	}
	await saveActivityLog(logData, method, path);
	logger.info(`${StatusCodes.OK} - Feeds with category id: ${categoryId} ${status} successfully - ${method} ${path}`);
	return res.status(StatusCodes.OK).json({message: `Feeds with category id: ${categoryId} ${status}.`});
}

const updateFeed = async (req, res) => {
	let {path, method, pathParams: {id: feedId}, user, body} = adaptRequest(req);
	if (!feedId || !mongoose.isValidObjectId(feedId)) {
		throw new BadRequestError('Invalid feed id.')
	}

	const {error} = validateFeedUpdateDto(body);
	if (error) {
		logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
		return res.status(StatusCodes.BAD_REQUEST).json({data: {errors: formatValidationError(error)}});
	}

	const feed = await Feed.findOneAndUpdate({_id: feedId}, body, {runValidators: true, new: true});
	if (!feed) {
		throw new BadRequestError('Feed update failed. Please check feed id');
	}
	const logData = {
		action: `updateFeed: ${feedId} - by ${user.role}`,
		resourceName: 'feeds',
		user: createObjectId(user.id),
	}
	await saveActivityLog(logData, method, path);
	logger.info(`${StatusCodes.OK} - Feed updated successfully - ${method} ${path}`);

	io.to('feeds').emit('feed:updated', {feed});
	return res.status(StatusCodes.OK).json({message: 'Feed updated successfully.', data: {feed}});
}

module.exports = {
	createFeed,
	getFeeds,
	getFeedById,
	deleteFeed,
	disableFeedById,
	updateFeed,
	toggleFeedsStatusByCategoryId,
	getFeedsByCategoryId,
	getFeedsByCategory,
}
