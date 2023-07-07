import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware';
import { constants } from '../lib/utils';
import {
  feedsFollowersStats,
  followAllFeedsInCategory,
  followFeed,
  getFollowedFeeds,
  latestPostsByFollowedFeeds,
  unfollowAllFeeds,
  unfollowAllFeedsInCategory,
  unfollowFeed,
} from '../controllers';

const router = Router();
const { ADMIN: admin } = constants.role;

router
  .route('/')
  .post(authenticateUser, followFeed)
  .get(authenticateUser, getFollowedFeeds)
  .delete(authenticateUser, unfollowAllFeeds);
router.route('/latest-posts').get(authenticateUser, latestPostsByFollowedFeeds);
router
  .route('/follow/category-feeds')
  .post(authenticateUser, followAllFeedsInCategory);
router
  .route('/unfollow/category-feeds')
  .delete(authenticateUser, unfollowAllFeedsInCategory);
router
  .route('/stats')
  .get(authenticateUser, authorizeRoles(admin), feedsFollowersStats);
router.route('/suggested').get(authenticateUser, feedsFollowersStats);
router.route('/:id').delete(authenticateUser, unfollowFeed);

export default router;
