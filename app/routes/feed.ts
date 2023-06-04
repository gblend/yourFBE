import {Router} from 'express';
import {authenticateUser, authorizeRoles} from '../middleware';
import {
    createFeed,
    deleteFeed,
    disableFeedById,
    getFeedById,
    getFeeds,
    getFeedsByCategory,
    getFeedsByCategoryId,
    getPostsByFeedId,
    toggleFeedsStatusByCategoryId,
    updateFeed
} from '../controllers';
import {constants} from '../lib/utils'

const router = Router();
const {ADMIN: admin} = constants.role;

router.route('/').get(getFeeds).post(authenticateUser, authorizeRoles(admin), createFeed);
router.route('/by_category').get(authenticateUser, getFeedsByCategory);
router.route('/:id').get(authenticateUser, getFeedById)
    .delete(authenticateUser, authorizeRoles(admin), deleteFeed)
    .patch(authenticateUser, authorizeRoles(admin), updateFeed);
router.route('/by_category/:id').get(authenticateUser, getFeedsByCategoryId);
router.route('/:id/posts').get(getPostsByFeedId);
router.route('/manage/:id').delete(authenticateUser, authorizeRoles(admin), disableFeedById)
    .patch(authenticateUser, authorizeRoles(admin), toggleFeedsStatusByCategoryId);

export default router;
