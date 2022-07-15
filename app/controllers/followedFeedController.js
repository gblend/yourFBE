'use strict';

const {StatusCodes} = require('http-status-codes');
const {adaptRequest, formatValidationError, logger, createObjectId,
	} = require('../lib/utils');
const {FollowedFeed, validateFollowedFeedDto, validateFollowFeedsInCategoryDto} = require('../models/FollowedFeed');
const {BadRequestError, CustomAPIError} = require('../lib/errors');
const mongoose = require('mongoose');
const {saveActivityLog} = require('../lib/dbActivityLog');
const {Feed} = require('../models/Feed');

const followFeed = async (req, res) => {
	const {body, method, path, user} = adaptRequest(req);
	body.user = createObjectId(user.id);
	body.feed = createObjectId(body.feed);

	const {error} = validateFollowedFeedDto(body);
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({data: {errors: formatValidationError(error)}});
	}

	const isFollowed = await FollowedFeed.findOne(body);
	let followedFeed = {}
	if (!isFollowed) {
		followedFeed = await FollowedFeed.create(body);
		if (!Object.keys(followedFeed).length) {
			throw new BadRequestError(`Unable to follow feed. Please try again later.`);
		}
		logger.info(`${StatusCodes.OK} - Followed feed ${body.feed} successfully - ${method} ${path}`);
	}

	res.status(StatusCodes.CREATED).json({message: 'Feed followed successfully.', data: {followedFeed}});
}

const followAllFeedsInCategory = async (req, res) => {
	const {body, method, path, user} = adaptRequest(req);
	const _user = createObjectId(user.id);
	const categoryId = createObjectId(body.category);

	const {error} = validateFollowFeedsInCategoryDto({user: _user, category: categoryId});
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({data: {errors: formatValidationError(error)}});
	}

	const categoryFeedsData = await Feed.find({category: categoryId, status: 'enabled'}, {'_id': 1}).populate('category', 'name')
		.then( (feed) => feed);
	if (categoryFeedsData.length < 1) {
		throw new BadRequestError(`No feed found for selected category`);
	}

	const categoryName = categoryFeedsData[0].category.name;
	const _categoryFeedsData = categoryFeedsData.map((feed) => {
		return {
			user: _user,
			feed: feed._id,
		}
	});

	try {
		const followCategoryFeeds = await FollowedFeed.insertMany(_categoryFeedsData, {ordered: false});
		if (!followCategoryFeeds) {
			return res.status(StatusCodes.BAD_REQUEST).json({message: `Unable to follow ${categoryName} category feeds`})
		}

		logger.info(`${StatusCodes.OK} - Successfully followed ${categoryName} category feeds  - ${method} ${path}`);
		res.status(StatusCodes.OK).json({message: `Successfully followed ${categoryName} category feeds`})
	} catch (err) {
		if (err.code && err.code === 11000 && err.result && err.result.result.ok) {
			return res.status(StatusCodes.OK).json({message: `Successfully followed ${categoryName} category feeds`})
		}
		throw new CustomAPIError(err.message)
	}
}

const unfollowAllFeedsInCategory = async (req, res) => {
	const {body, method, path, user} = adaptRequest(req);
	const _user = createObjectId(user.id);
	const categoryId = createObjectId(body.category);

	const {error} = validateFollowFeedsInCategoryDto({user: _user, category: categoryId});
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({data: {errors: formatValidationError(error)}});
	}

	const unfollowedFeeds = await FollowedFeed.deleteMany({user: _user, category: categoryId});
	if (unfollowedFeeds.deletedCount === 0) {
		throw new BadRequestError(`You don't follow any feed in this category.`);
	}
	logger.info(`${StatusCodes.OK} - All feeds in category: ${categoryId} unfollowed successfully - ${method} ${path}`);

	const logData = {
		action: `unfollowAllFeedsInCategory - by ${user.role}`,
		resourceName: 'followedFeeds',
		user: createObjectId(_user),
	}
	await saveActivityLog(logData, method, path);
	res.status(StatusCodes.OK).json({message: 'All feeds in this category unfollowed successfully.'});
}

const unfollowFeed = async (req, res) => {
	const {pathParams: {id: followedFeedId}, method, path} = adaptRequest(req);
	if (!followedFeedId || !mongoose.isValidObjectId(followedFeedId)) {
		throw new BadRequestError(`Invalid followed feed id: ${followedFeedId}`);
	}

	const deleted = await FollowedFeed.findOneAndDelete({_id: createObjectId(followedFeedId)});
	if (!deleted) {
		throw new BadRequestError(`Followed feed ${followedFeedId} does not exist.`);
	}

	logger.info(`${StatusCodes.OK} - Feed unfollowed successfully - ${method} ${path}`);
	res.status(StatusCodes.OK).json({message: 'Feed unfollowed successfully.'});
}

const unfollowAllFeeds = async (req, res) => {
	const {user: {id: userId, role}, method, path} = adaptRequest(req);

	const deleted = await FollowedFeed.deleteMany({user: userId});
	if (deleted.deletedCount === 0) {
		throw new BadRequestError('No followed feeds found to unfollow.');
	}
	logger.info(`${StatusCodes.OK} - All feeds unfollowed successfully - ${method} ${path}`);

	const logData = {
		action: `unfollowAllFeeds - by ${role}`,
		resourceName: 'followedFeeds',
		user: createObjectId(userId),
	}
	await saveActivityLog(logData, method, path);
	res.status(StatusCodes.OK).json({message: 'All feeds unfollowed successfully.'});
}

module.exports = {
	followFeed,
	unfollowFeed,
	unfollowAllFeeds,
	followAllFeedsInCategory,
	unfollowAllFeedsInCategory
}
