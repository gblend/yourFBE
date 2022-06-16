const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication');

const {
	followFeed,
	unfollowFeed,
	unfollowAllFeeds,
	latestPostsByFollowedFeeds,
} = require('../controllers/followedFeedController');

router.route('/').post(authenticateUser, followFeed)
	.get(authenticateUser, latestPostsByFollowedFeeds)
	.delete(authenticateUser, unfollowAllFeeds);
router.route('/:id').delete(authenticateUser, unfollowFeed);

module.exports = router;
