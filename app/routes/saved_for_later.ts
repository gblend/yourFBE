import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware';
import {
  allStarredFeedPostsStats,
  deletePostSavedForLater,
  getPostSavedForLater,
  getPostsSavedForLater,
  markPostSavedForLaterAsRead,
  savePostForLater,
  userStarredFeedPostsStats,
} from '../controllers';
import { constants } from '../lib/utils';

const router = Router();
const { ADMIN: admin } = constants.role;

router
  .route('/posts')
  .post(authenticateUser, savePostForLater)
  .get(authenticateUser, getPostsSavedForLater);
router.route('/posts/stats').get(authenticateUser, userStarredFeedPostsStats);
router
  .route('/posts/all/stats')
  .get(authenticateUser, authorizeRoles(admin), allStarredFeedPostsStats);
router
  .route('/posts/:id')
  .get(authenticateUser, getPostSavedForLater)
  .delete(authenticateUser, deletePostSavedForLater)
  .patch(authenticateUser, markPostSavedForLaterAsRead);

export default router;
