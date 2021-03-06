'use strict';

const express = require('express');
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const router = express.Router();
const {
    getAllUsers,
    getAllAdmins,
    getSingleUser,
    updateUser,
    updatePassword,
    showCurrentUser,
    enableUserAccount,
    getDisabledAccounts,
    disableUserAccount
} = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/disabled-accounts').get(authenticateUser, authorizePermissions('admin'), getDisabledAccounts);
router.route('/admins').get(authenticateUser, authorizePermissions('admin'), getAllAdmins);
router.route('/update-password').patch(authenticateUser, updatePassword);
router.route('/accounts/moderate/:id').delete(authenticateUser, authorizePermissions('admin', 'user'), disableUserAccount).patch(authenticateUser, enableUserAccount);
router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/:id').get(authenticateUser, getSingleUser);
router.route('/update/:id').patch(authenticateUser, updateUser);

module.exports = router;
