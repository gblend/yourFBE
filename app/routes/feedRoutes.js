const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');
const {
	getFeedsByCategory,
	createFeed,
	deleteFeed,
	disableFeedById,
	disableFeedsByCategoryId,
	getFeedById,
	getFeeds,
	getFeedsByCategoryId,
	updateFeed,
} = require('../controllers/feedController');

router.route('/').get(getFeeds)
	.post(authenticateUser, authorizePermissions('admin'), createFeed);
router.route('/:id').get(authenticateUser, getFeedById)
	.delete(authenticateUser, authorizePermissions('admin'), deleteFeed)
	.patch(authenticateUser, authorizePermissions('admin'), updateFeed);
router.route('/category').get(authenticateUser, getFeedsByCategory);
router.route('/category/:id').get(authenticateUser, getFeedsByCategoryId);
router.route('/disable/:id').delete(authenticateUser, authorizePermissions('admin'), disableFeedById)
	.patch(authenticateUser, authorizePermissions('admin'), disableFeedsByCategoryId);

module.exports = router;
