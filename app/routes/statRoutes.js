const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const {
	adminDashboardStats,
	userDashboardStats,
} = require('../controllers/statisticController.js');

router.route('/admin').get(authenticateUser, authorizePermissions('admin'), adminDashboardStats);
router.route('/users/:id').get(authenticateUser, userDashboardStats);

module.exports = router;
