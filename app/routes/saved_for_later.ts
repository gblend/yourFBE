import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';
import {
	savePostForLater,
	deletePostSavedForLater,
	getPostsSavedForLater,
	getPostSavedForLater,
	markPostSavedForLaterAsRead,
	userStarredFeedPostsStats,
	allStarredFeedPostsStats
} from '../controllers/savedForLaterController';

router.route('/posts').post(authenticateUser, savePostForLater).get(authenticateUser, getPostsSavedForLater);
router.route('/posts/stats').get(authenticateUser, userStarredFeedPostsStats);
router.route('/posts/all/stats').get(authenticateUser, authorizePermissions('admin'), allStarredFeedPostsStats);
router.route('/posts/:id').get(authenticateUser, getPostSavedForLater)
	.delete(authenticateUser, deletePostSavedForLater).patch(authenticateUser, markPostSavedForLaterAsRead);

export default router;
