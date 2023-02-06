import {User} from '../models/User';
import {logger} from '../lib/utils';
import {IUser} from '../interface';
import {Profile as FacebookProfile} from 'passport-facebook';
import {Profile as GoogleProfile} from 'passport-google-oauth20';
import {Profile as TwitterProfile} from 'passport-twitter';
import {CustomAPIError} from '../lib/errors';

const registerSocialProfile = async (profile: any, callback: (...payload: any) => any, strategy: string = 'default') => {
	let data: IUser = {
		avatar: '',
		firstname: '',
		gender: '',
		lastLogin: new Date(Date.now()),
		lastname: '',
		verified: new Date(Date.now()),
		email: '',
		isVerified: false
	};
	let user: IUser = {}

	switch (strategy) {
		case 'google':
			data = transformGoogleData(profile);
			break;
		case 'twitter':
			data = transformTwitterData(profile);
			break;
		case 'facebook':
			data = transformFacebookData(profile);
			break;
		case 'default':
			data = transformProfileData(profile);
			break;
		default:
			return data;
	}

	if (!data.email) data.email = profile.id;
	if (!data.gender) data.gender = 'NA';
	data.socialChannel = profile.provider;
	data.socialChannelId = profile.id;

	const searchQuery = {
		lastname: data.lastname,
		email: data.email
	};

	const options = {
		upsert: true,
		new: true
	};

	try {
		user = await User.findOneAndUpdate(searchQuery, data, options) as IUser;
		if (strategy === 'default') return user;

		return callback(null, user);
	} catch (error: any) {
		if(error.code && error.code === 11000) {
			logger.info(`${strategy}Strategy - Duplicate value entered for ${Object.keys(error.keyValue)} field.`);
			if (strategy === 'default') {
				throw new CustomAPIError(`This ${Object.keys(error.keyValue)} is already in use.`);
			}

			return callback(null, await User.findOne({ email: data.email }));
		}
		logger.info(`Social login ${strategy}Strategy - ${error.message}`)
	}
}

const transformGoogleData = (profile: GoogleProfile) => {
	const {
		name: displayName,
		given_name: firstname,
		family_name: lastname,
		picture,
		email = null,
		email_verified,
	} = profile._json;

	const displayNames = displayName?.split(' ');
	return {
		firstname: firstname ?? displayNames![0],
		lastname: lastname ?? displayNames![1],
		email,
		gender: null,
		avatar: picture,
		verified: new Date(Date.now()),
		isVerified: email_verified,
		lastLogin: new Date(Date.now())
	};
}

const transformTwitterData = (profile: TwitterProfile) => {
	const {
		name,
		profile_image_url_https: profileImg,
		email = null,
	} = profile._json;

	const displayNames = profile.displayName?.split(' ') || name?.split(' ');
	return {
		firstname: displayNames[0],
		lastname: displayNames[1],
		email,
		gender: (profile.gender) ? profile.gender : null,
		avatar: profileImg,
		verified: new Date(Date.now()),
		isVerified: false,
		lastLogin: new Date(Date.now())
	};
}

const transformFacebookData = (profile: FacebookProfile) => {
	const {
		picture: { data: {url: pictureUrl} },
		name,
		email = null,
		last_name,
		first_name,
		gender: userGender = null,
	} = profile._json;

	const displayNames = (profile.displayName.length) ? profile.displayName.split(' ') : name?.split('');
	return {
		firstname: first_name ?? displayNames[0],
		lastname: last_name ?? displayNames[1],
		email,
		gender: userGender,
		avatar: pictureUrl ?? '',
		verified: new Date(Date.now()),
		isVerified: true,
		lastLogin: new Date(Date.now())
	};
}

const transformProfileData = (profile: any) => {
	const {
		provider: socialProvider,
		id: socialProviderID,
		gender: userGender = 'null',
		name: displayName,
		firstname,
		lastname,
		picture,
		email,
		email_verified,
	} = profile;

	const names = displayName?.split(' ');
	return {
		email,
		gender: userGender,
		avatar: picture,
		socialChannel: socialProvider,
		socialChannelId: socialProviderID,
		verified: new Date(Date.now()),
		isVerified: email_verified,
		lastLogin: new Date(Date.now()),
		firstname: firstname ?? names[0],
		lastname: lastname ?? names[1]
	};
}

export {
	registerSocialProfile
}
