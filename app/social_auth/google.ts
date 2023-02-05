const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {config} = require('../config/config');
const init = require('./init');
const {registerSocialProfile} = require('./register_social_profile');

passport.use('google', new GoogleStrategy({
		clientID: config.auth.google.clientID,
		clientSecret: config.auth.google.clientSecret,
		callbackURL: config.auth.google.callbackURL,
	},
	async (_accessToken, _refreshToken, profile, cb) => {
	return registerSocialProfile(profile, cb, 'google');
	}

));

// serialize user into the session
init();

module.exports = passport;
