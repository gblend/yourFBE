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


router.route('/').post(authenticateUser, authorizePermissions('admin'), createConfig)
	.get(authenticateUser, authorizePermissions('admin'), getAllConfig);
router.route('/:id').get(authenticateUser, authorizePermissions('admin'), getSingleConfig)
	.patch(authenticateUser, authorizePermissions('admin'), updateConfig)
	.delete(authenticateUser, authorizePermissions('admin'), deleteConfig);
router.route('/disable/:id').patch(authenticateUser, authorizePermissions('admin'), disableConfig);

module.exports = router;
