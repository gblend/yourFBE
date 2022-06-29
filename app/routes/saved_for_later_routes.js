'use strict';

const router = require('express').Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');
const {
	savePostForLater,
	deletePostSavedForLater,
	getPostsSavedForLater,
	getPostSavedForLater,
	markPostSavedForLaterAsRead,
	userStarredFeedPostsStats,
	allStarredFeedPostsStats,
} = require('../controllers/savedForLaterController');

router.route('/posts').post(authenticateUser, savePostForLater).get(authenticateUser, getPostsSavedForLater);
router.route('/posts/stats').get(authenticateUser, userStarredFeedPostsStats);
router.route('/posts/all/stats').get(authenticateUser, authorizePermissions('admin'), allStarredFeedPostsStats);
router.route('/posts/:id').get(authenticateUser, getPostSavedForLater)
	.delete(authenticateUser, deletePostSavedForLater).patch(authenticateUser, markPostSavedForLaterAsRead);

module.exports = router;
