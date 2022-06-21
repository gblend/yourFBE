'use strict';

const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication');

const {
	followFeed,
	unfollowFeed,
	unfollowAllFeeds,
	latestPostsByFollowedFeeds,
	getFollowedFeeds,
} = require('../controllers/followedFeedController');

router.route('/').post(authenticateUser, followFeed)
	.get(authenticateUser, getFollowedFeeds)
	.delete(authenticateUser, unfollowAllFeeds);
router.route('/latest-posts').get(authenticateUser, latestPostsByFollowedFeeds);
router.route('/:id').delete(authenticateUser, unfollowFeed);

module.exports = router;
