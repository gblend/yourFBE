const {adaptRequest, logger} = require('../lib/utils');
const {FollowedFeed} = require('../models/FollowedFeed');
const {SavedForLater} = require('../models/SavedForLater');
const {StatusCodes} = require('http-status-codes');
const {Feed} = require('../models/Feed');
const {FeedCategory} = require('../models/FeedCategory');

const userDashboardStats = async (req, res) => {
	const {pathParams: {id: userId}, method, path} = adaptRequest(req);

	const followedFeedsQuery = await FollowedFeed.find({user: userId}).populate('feedFollowed');
	const followedFeeds = followedFeedsQuery;
	const totalFollowedFeeds = await followedFeedsQuery.countDocuments().exec();

	const totalSavedForLater = await SavedForLater.find({user: userId, status: 'enabled'}).countDocuments().exec();

	const distinctCategories = [];

	followedFeeds.map((feed) => {
		if (distinctCategories.indexOf(feed.feedFollowed.category) === -1) {
			distinctCategories.push(feed.feedFollowed.category);
		}
	});

	logger.info(`${StatusCodes.OK} - Stats fetched successfully - ${method} ${path}`);
	res.status(StatusCodes.OK).json({
		message: 'Stats fetched successfully.',
		data: {
			totalFollowedFeeds,
			totalSavedForLater,
			categoriesFollowed: distinctCategories.length - 1
		}
	});
}

const adminDashboardStats = async (req, res) => {
	const { method, path} = adaptRequest(req);

	const totalFeeds = await Feed.find({status: 'enabled'}).countDocuments().exec();

	const totalFollowedFeeds = await FollowedFeed.find({}).countDocuments().exec();

	const totalCategories = await FeedCategory.find({status: 'enabled'}).countDocuments().exec();

	const result = Promise.all([totalFeeds, totalFollowedFeeds, totalCategories]);

	logger.info(`${StatusCodes.OK} - Stats fetched successfully - ${method} ${path}`)
	res.status(StatusCodes.OK).json({
		message: 'Stats fetched successfully.',
		data: {
			stats: result
		}
	});
}

module.exports = {
	userDashboardStats,
	adminDashboardStats,
}
