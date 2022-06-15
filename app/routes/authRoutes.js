'use strict';

const express = require('express');

const router = express.Router();
const {register, login, logout, verifyEmail, resetPassword, forgotPassword, resendVerificationEmail} = require('../controllers/authController');
const {authenticateUser} = require('../middleware/authentication');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').delete(authenticateUser, logout);
router.route('/verify-email').post(verifyEmail);
router.route('/reset-password').post(resetPassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/resend-verification-email').post(authenticateUser, resendVerificationEmail);

module.exports = router;

