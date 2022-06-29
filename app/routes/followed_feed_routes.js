'use strict';

const router = require('express').Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const {
	followFeed,
	unfollowFeed,
	unfollowAllFeeds,
	latestPostsByFollowedFeeds,
	getFollowedFeeds,
	feedsFollowersStats,
	followAllFeedsInCategory,
	unfollowAllFeedsInCategory,
} = require('../controllers/followedFeedController');

router.route('/').post(authenticateUser, followFeed).get(authenticateUser, getFollowedFeeds)
	.delete(authenticateUser, unfollowAllFeeds);
router.route('/latest-posts').get(authenticateUser, latestPostsByFollowedFeeds);
router.route('/follow/category-feeds').post(authenticateUser, followAllFeedsInCategory);
router.route('/unfollow/category-feeds').delete(authenticateUser, unfollowAllFeedsInCategory);
router.route('/stats').get(authenticateUser, authorizePermissions('admin'), feedsFollowersStats);
router.route('/suggested').get(authenticateUser, feedsFollowersStats);
router.route('/:id').delete(authenticateUser, unfollowFeed);

module.exports = router;
