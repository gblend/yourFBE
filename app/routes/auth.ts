import {Router} from 'express';
const router = Router();
import {Request, Response} from '../types/index';

import {
	register,
	login,
	logout,
	verifyEmail,
	resetPassword,
	forgotPassword,
	resendVerificationEmail,
	socialLogin,
	socialLoginError
} from '../controllers/authController';

import {authenticateUser} from '../middleware/authentication';
import {passportGoogle} from '../social_auth/google';
import {passportFacebook} from '../social_auth/facebook';
import {passportTwitter} from '../social_auth/twitter';

router.route('/signup').post(register);
router.route('/login').post(login);
router.route('/social-error').get(socialLoginError);
router.route('/login/social').post(socialLogin);
router.route('/logout').delete(authenticateUser, logout);
router.route('/verify-account').post(verifyEmail);
router.route('/reset-password').post(resetPassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/resend-verification-email').post(authenticateUser, resendVerificationEmail);

router.route('/google/login').get(passportGoogle
	.authenticate('google', {scope: [ 'email', 'profile' ]}, (_: Request, __: Response) => { /* auto redirected */} ));
router.route('/google/callback').get(passportGoogle
		.authenticate('google', { assignProperty: 'socialProfile', failureRedirect: '/api/v1/auth/social-error' }),
	(req: Request, res: Response) => socialLogin(req, res));

router.route('/facebook/login').get(passportFacebook
	.authenticate('facebook', (_: Request, __: Response) => { /* auto redirected */}));
router.route('/facebook/callback').get(passportFacebook
		.authenticate('facebook', { assignProperty: 'socialProfile', failureRedirect: '/api/v1/auth/social-error' }),
	(req: Request, res: Response) => socialLogin(req, res));

router.route('/twitter/login').get(passportTwitter
	.authenticate('twitter', {}, (_: Request, __: Response) => { /* auto redirected */}));
router.route('/twitter/callback').get(passportTwitter
		.authenticate('twitter', { assignProperty: 'socialProfile', failureRedirect: '/api/v1/auth/social-error' }),
	(req: Request, res: Response) => socialLogin(req, res));

export default router;

