const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const {} = require('../controllers/followedFeedController');

module.exports = router;