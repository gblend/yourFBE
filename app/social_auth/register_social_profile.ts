const {User} = require('../models/User');
const {logger} = require('../lib/utils');

module.exports.registerSocialProfile = async (profile, callback, strategy = 'default') => {
	let data = {};

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
	data.socialChannel = profile.provider;
	data.socialChannelId = profile.id;

	const searchQuery = {
		// socialChannel: data.provider,
		// socialChannelId: data.id,
		email: data.email
	};

	const options = {
		upsert: true,
		new: true
	};

	try {
		// update the user if s/he exists or add a new user
		const user = await User.findOneAndUpdate(searchQuery, data, options);
		if (strategy === 'default') return user;

		return callback(null, user);
	} catch (error) {
		if(error.code && error.code === 11000) {
			logger.info(`${strategy}Strategy - Duplicate value entered for ${Object.keys(error.keyValue)} field.`);
			if (strategy === 'default') return user;

			return callback(null, await User.findOne({ email }));
		}
		logger.info(`${strategy}Strategy - ${error.message}`)
	}
}

const transformGoogleData = (profile) => {
	let {
		name: displayName,
		given_name: firstname,
		family_name: lastname,
		picture,
		email = null,
		email_verified,
	} = profile._json;

	const displayNames = displayName?.split(' ');
	return {
		firstname: firstname ?? displayNames[0],
		lastname: lastname ?? displayNames[1],
		email,
		gender: (profile.gender) ? profile.gender : null,
		avatar: picture,
		verified: Date.now(),
		isVerified: email_verified,
		lastLogin: Date.now()
	};
}

const transformTwitterData = (profile) => {
	let {
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
		verified: Date.now(),
		isVerified: false,
		lastLogin: Date.now()
	};
}

const transformFacebookData = (profile) => {
	let {
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
		verified: Date.now(),
		isVerified: true,
		lastLogin: Date.now()
	};
}

const transformProfileData = (profile) => {
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
		verified: Date.now(),
		isVerified: email_verified,
		lastLogin: Date.now(),
		firstname: firstname ?? names[0],
		lastname: lastname ?? names[1]
	};
}
