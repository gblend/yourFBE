const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const {
	getAllConfig,
	createConfig,
	getSingleConfig,
	updateConfig,
	disableConfig,
	deleteConfig,
} = require('../controllers/configController');


router.route('/')
module.exports = router;
