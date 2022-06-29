'use strict';

const router = require('express').Router();

const {
	register,
	login,
	logout,
	verifyEmail,
	resetPassword,
	forgotPassword,
	resendVerificationEmail,
	socialLogin,
	socialLoginError
} = require('../controllers/authController');

const {authenticateUser} = require('../middleware/authentication');
const passportGoogle = require('../auth/google');
const passportFacebook = require('../auth/facebook');
const passportTwitter = require('../auth/twitter');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/social-error').get(socialLoginError);
router.route('/login/social').post(socialLogin);
router.route('/logout').delete(authenticateUser, logout);
router.route('/verify-email').post(verifyEmail);
router.route('/reset-password').post(resetPassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/resend-verification-email').post(authenticateUser, resendVerificationEmail);

router.route('/google/login').get(passportGoogle
	.authenticate('google', {scope: [ 'email', 'profile' ]}, (_, __) => { /* auto redirected */} ));
router.route('/google/callback').get(passportGoogle
		.authenticate('google', { assignProperty: 'socialProfile', failureRedirect: '/api/v1/auth/social-error' }),
	(req, res) => socialLogin(req, res));

router.route('/facebook/login').get(passportFacebook
	.authenticate('facebook', { authType: 'reauthenticate'}, (_, __) => { /* auto redirected */}));
router.route('/facebook/callback').get(passportFacebook
		.authenticate('facebook', { assignProperty: 'socialProfile', failureRedirect: '/api/v1/auth/social-error' }),
	(req, res) => socialLogin(req, res));

router.route('/twitter/login').get(passportFacebook
	.authenticate('twitter', {}, (_, __) => { /* auto redirected */}));
router.route('/twitter/callback').get(passportTwitter
		.authenticate('twitter', { assignProperty: 'socialProfile', failureRedirect: '/api/v1/auth/social-error' }),
	(req, res) => socialLogin(req, res));

module.exports = router;

