const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const {config} = require('../config/config');
const init = require('./init');
const {registerSocialProfile} = require("./register_social_profile");

passport.use('facebook', new FacebookStrategy({
		clientID: config.auth.facebook.clientID,
		clientSecret: config.auth.facebook.clientSecret,
		callbackURL: config.auth.facebook.callbackURL,
		profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name', 'profileUrl'],
		enableProof: true
	},
	async (_accessToken, _refreshToken, profile, cb) => {
		return registerSocialProfile(profile, cb, 'facebook');
	}
));

// serialize user into the session
init();

module.exports = passport;
