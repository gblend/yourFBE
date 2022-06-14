const express = require('express');
const router = express.Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const {getActivityLogs, getActivityLog, getPollingLogs, getPollingLog, searchLogs} = require('../controllers/logController');

router.route('/activity').get(authenticateUser, authorizePermissions('admin'), getActivityLogs);
router.route('/activity/:id').get(authenticateUser, authorizePermissions('admin'), getActivityLog);
router.route('/polling').get(authenticateUser, authorizePermissions('admin'), getPollingLogs);
router.route('/polling/:id').get(authenticateUser, authorizePermissions('admin'), getPollingLog);
router.route('/search').get(authenticateUser, authorizePermissions('admin'), searchLogs);

module.exports = router;
