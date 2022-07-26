const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const {config} = require('../config/config');
const init = require('./init');
const {registerSocialProfile} = require('./register_social_profile');

passport.use('twitter', new TwitterStrategy({
		consumerKey: config.auth.twitter.consumerKey,
		consumerSecret: config.auth.twitter.consumerSecret,
		callbackURL: config.auth.twitter.callbackURL,
	},
	async (_accessToken, _refreshToken, profile, cb) => {
		return registerSocialProfile(profile, cb, 'twitter');
	}
));

// serialize user into the session
init();

module.exports = passport;
