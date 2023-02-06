import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

import {
	followFeed,
	unfollowFeed,
	unfollowAllFeeds,
	latestPostsByFollowedFeeds,
	getFollowedFeeds,
	feedsFollowersStats,
	followAllFeedsInCategory,
	unfollowAllFeedsInCategory
} from '../controllers/followedFeedController';

router.route('/').post(authenticateUser, followFeed).get(authenticateUser, getFollowedFeeds)
	.delete(authenticateUser, unfollowAllFeeds);
router.route('/latest-posts').get(authenticateUser, latestPostsByFollowedFeeds);
router.route('/follow/category-feeds').post(authenticateUser, followAllFeedsInCategory);
router.route('/unfollow/category-feeds').delete(authenticateUser, unfollowAllFeedsInCategory);
router.route('/stats').get(authenticateUser, authorizePermissions('admin'), feedsFollowersStats);
router.route('/suggested').get(authenticateUser, feedsFollowersStats);
router.route('/:id').delete(authenticateUser, unfollowFeed);

export default router;
