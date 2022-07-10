'use strict';

const {Token} = require('../models/Token');
const {config} = require('../config/config');
const {saveActivityLog} = require('../lib/dbActivityLog');
const {pushToQueue} = require('../lib/utils/amqplib');
const {generateToken} = require('../lib/utils/verification_token');
const {User, validateLogin, validateUserDto} = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {registerSocialProfile} = require('../social_auth/register_social_profile');
const {CustomAPIError, UnauthenticatedError, BadRequestError} = require('../lib/errors');
const {
	attachCookiesToResponse,
	createHash,
	encrypt,
	formatValidationError,
	constants,
	adaptRequest,
	logger,
	redisRefreshCache,
	createObjectId,
} = require('../lib/utils');

let queueName = '', queueErrorMsg = '';

const register = async (req, res) => {
	const {body, ip, headers} = adaptRequest(req);
	const {email, firstname, lastname, password} = body;
	const {error} = validateUserDto(body);
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			data: {errors: formatValidationError(error)}
		});
	}

	const isEmailExist = await User.findOne({email});
	if (isEmailExist) {
		throw new CustomAPIError(constants.auth.ALREADY_IN_USE('Email address'));
	}

	const isAdminExists = (await User.countDocuments({role: 'admin'})) === 0;
	const role = isAdminExists ? 'admin' : 'user';
	const isVerified = isAdminExists;

	const verificationToken = generateToken();
	const user = await User.create({email, firstname, lastname, password, role, verificationToken, isVerified});
	(role === 'admin') ? await redisRefreshCache(config.cache.allAdminCacheKey) : await redisRefreshCache(config.cache.allUsersCacheKey);
	const accessTokenJWT = await user.createJWT();
	// send verify email via queue
	queueErrorMsg = 'Unable to queue verify email, please try again';
	queueName = config.amqp.verifyEmailQueue;
	await pushToQueue(queueName, queueErrorMsg, {
		name: user.firstname,
		email: user.email,
		verificationToken: user.verificationToken
	}).catch(err => logger.error(`Queue error: ${err.message}`));
	user.password = undefined;

	const tokenInfo = await saveTokenInfo(user, {ip, headers});
	const refreshTokenJWT = await user.createRefreshJWT(user, tokenInfo.refreshToken);
	attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});
	return res.status(StatusCodes.OK).json({
		message: 'Please check your email for a link to verify your account',
		data: {
			token: accessTokenJWT,
			refreshToken: refreshTokenJWT,
			user,
		}
	});
}

const login = async (req, res) => {
	const {body, headers, ip} = adaptRequest(req);
	let verificationMsg = '';
	const {error} = validateLogin(body);
	if (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			data: {
				errors: formatValidationError(error)
			}
		});
	}

	const {email, password} = body;
	const user = await User.findOne({email}).select('-verificationToken');
	if (!user) {
		throw new BadRequestError(constants.auth.INVALID_CREDENTIALS());
	}

	const isMatch = await user.comparePassword(password);
	if (!isMatch) {
		throw new BadRequestError('Invalid email or password.');
	}

	if (user.status === 'disabled') {
		throw new UnauthenticatedError('Account is deactivated. Please contact support.');
	}

	if (!user.isVerified) {
		verificationMsg = 'Please verify your email to get full access to your account capabilities.';
	} else verificationMsg = 'Verified';

	const accessTokenJWT = await user.createJWT();
	user.lastLogin = Date.now();
	await user.save();
	const tokenInfo = await saveTokenInfo(user, {ip, headers});
	const refreshTokenJWT = await user.createRefreshJWT(user, tokenInfo.refreshToken);

	attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});
	user.password = undefined;
	return res.json({
		data: {
			token: accessTokenJWT,
			refreshToken: refreshTokenJWT,
			verificationMsg,
			user,
		},
		message: constants.auth.SUCCESSFUL('Login'),
	});
}

const socialLogin = async (req, res, ) => {
	const {headers, ip, socialProfile, body: {profileData, updateProfile = false}} = adaptRequest(req);
	let user = {};

	if(updateProfile) {
		if (!profileData || !Object.keys(profileData).length || !profileData.email) {
			throw new CustomAPIError('Invalid social profile parameters.');
		}

		user = await registerSocialProfile(profileData, (_, __) => { /*unused */ });
	} else user = socialProfile;

	if (!user || !Object.keys(user).length) {
		throw new CustomAPIError('Invalid social profile parameters.');
	}

	if (user.status === 'disabled') {
		throw new UnauthenticatedError('Account is disabled. Please contact support.');
	}

	const accessTokenJWT = await user.createJWT();
	const tokenInfo = await saveTokenInfo(user, {ip, headers});
	const refreshTokenJWT = await user.createRefreshJWT(user, tokenInfo.refreshToken);

	attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});
	return res.json({
		data: {
			token: accessTokenJWT,
			refreshToken: refreshTokenJWT,
			user
		},
		message: constants.auth.SUCCESSFUL('Login'),
	});
}

const logout = async (req, res) => {
	const {user, signedCookies} = adaptRequest(req);
	await Token.findOneAndDelete({user: user.id});

	signedCookies.accessToken = undefined;
	signedCookies.refreshToken = undefined;
	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');

	res.status(StatusCodes.NO_CONTENT).json({});
}

const forgotPassword = async (req, res) => {
	const {body: {email}} = adaptRequest(req);
	if (!email) {
		throw new BadRequestError('Please enter a valid email');
	}

	const user = await User.findOne({email});
	if (user) {
		const passwordToken = generateToken();

		// queue reset password email
		queueErrorMsg = 'Unable to queue reset password email, please try again';
		queueName = config.amqp.resetEmailQueue;
		await pushToQueue(queueName, queueErrorMsg, {name: user.firstname, email: user.email, passwordToken});

		const tenMinutes = 1000 * 10 * 60;
		const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
		user.passwordToken = encrypt(passwordToken);
		user.passwordTokenExpirationDate = passwordTokenExpirationDate;
		await user.save();
	}
	res.status(StatusCodes.OK).json({message: 'Please check your email for reset link. You will not get an email if the email address you provided is incorrect'});
}

const resetPassword = async (req, res) => {
	const {body: {email, token, password}, method, path} = adaptRequest(req);
	if (!email || !token || !password) {
		throw new BadRequestError('Please provide all values - email, token, password');
	}

	const user = await User.findOne({email});
	if (!user) {
		throw new BadRequestError('Account not found.');
	}

	if (user.passwordToken !== encrypt(token)) {
		throw new BadRequestError('Invalid password reset token');
	}

	const currentDate = new Date();
	if (user.passwordTokenExpirationDate < currentDate) {
		throw new BadRequestError('Password reset link has expired');
	}

	user.passwordTokenExpirationDate = null;
	user.passwordToken = '';
	user.password = password;
	await user.save();

	const logData = {
		action: `resetPassword - by ${user.role}`,
		resourceName: 'users',
		user: user?.id,
	}
	await saveActivityLog(logData, method, path);
	res.status(StatusCodes.OK).json({
		message: 'Password changed successfully.'
	});
}

const verifyEmail = async (req, res) => {
	const {body: {email, token}} = adaptRequest(req);
	const user = await User.findOne({email});
	if (!user) {
		throw new UnauthenticatedError('Verification failed');
	}
	if (user.verificationToken !== token) {
		throw new UnauthenticatedError('Verification failed, invalid token');
	}

	user.isVerified = true;
	user.verificationToken = '';
	user.verified = Date.now();
	user.save();
	res.status(StatusCodes.OK).json({message: 'Email successfully verified'});
}

const saveTokenInfo = async ({_id: userId}, {ip, headers}) => {
	const isTokenExist = await Token.findOne({user: userId});
	if (isTokenExist) {
		if (!isTokenExist.isValid) {
			throw new UnauthenticatedError(constants.auth.INVALID_CREDENTIALS);
		}
		return isTokenExist;
	}
	const refreshToken = generateToken();
	const userAgent = headers['user-agent'] || 'unknown';
	const userToken = {refreshToken, ip, userAgent, user: userId};
	return Token.create(userToken);
}

const resendVerificationEmail = async (req, res) => {
	const {user: {id: userId}} = adaptRequest(req);

	const userAccount = await User.findOne({_id: createObjectId(userId)});
	if (!userAccount) {
		throw new BadRequestError('Account not found.');
	}

	userAccount.verificationToken = generateToken();
	await userAccount.save();
	// send verify email via queue
	queueErrorMsg = 'Unable to queue verify email, please try again';
	queueName = config.amqp.verifyEmailQueue;
	await pushToQueue(queueName, queueErrorMsg, {
		name: userAccount.firstname,
		email: userAccount.email,
		verificationToken: userAccount.verificationToken
	}).catch(err => logger.error(`Queue error: ${err.message}`));

	return res.status(StatusCodes.OK).json({
		message: 'Please check your email for a link to verify your account',
	});
}

module.exports = {
	register,
	logout,
	login,
	resetPassword,
	forgotPassword,
	resendVerificationEmail,
	socialLogin,
	verifyEmail
}
