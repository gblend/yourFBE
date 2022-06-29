'use strict';

const router = require('express').Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');
const {
	getFeedsByCategory,
	createFeed,
	deleteFeed,
	disableFeedById,
	toggleFeedsStatusByCategoryId,
	getFeedById,
	getFeeds,
	getFeedsByCategoryId,
	updateFeed,
	getPostsByFeedId,
} = require('../controllers/feedController');

router.route('/').get(getFeeds).post(authenticateUser, authorizePermissions('admin'), createFeed);
router.route('/category').get(authenticateUser, getFeedsByCategory);
router.route('/:id').get(authenticateUser, getFeedById)
	.delete(authenticateUser, authorizePermissions('admin'), deleteFeed)
	.patch(authenticateUser, authorizePermissions('admin'), updateFeed);
router.route('/category/:id').get(authenticateUser, getFeedsByCategoryId);
router.route('/:id/posts').get(getPostsByFeedId);
router.route('/manage/:id').delete(authenticateUser, authorizePermissions('admin'), disableFeedById)
	.patch(authenticateUser, authorizePermissions('admin'), toggleFeedsStatusByCategoryId);

module.exports = router;
