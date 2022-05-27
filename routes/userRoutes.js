'use strict';

const express = require('express');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const router = express.Router();
const {
    getAllUsers,
    getAllAdmins,
    getSingleUser,
    updateUser,
    updateUserPassword,
    showCurrentUser,
    disableUserAccount
} = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/admins').get(authenticateUser, authorizePermissions('admin'), getAllAdmins);
router.route('/:id').delete(authenticateUser, authorizePermissions('admin'), disableUserAccount);
router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser).patch(authenticateUser, updateUser);

module.exports = router;
