'use strict';

const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../middleware/authentication');
const {
	savePostForLater,
	deletePostSavedForLater,
	getPostsSavedForLater,
	getPostSavedForLater,
	markPostSavedForLaterAsRead,
} = require('../controllers/savedForLaterController');

router.route('/posts').post(authenticateUser, savePostForLater).get(authenticateUser, getPostsSavedForLater);
router.route('/posts/:id').get(authenticateUser, getPostSavedForLater)
	.delete(authenticateUser, deletePostSavedForLater).patch(authenticateUser, markPostSavedForLaterAsRead);

module.exports = router;
