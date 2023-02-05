import passport from 'passport';
import {Strategy as FacebookStrategy, Profile} from 'passport-facebook';

import {config} from '../config/config';
import init from './init';
import {registerSocialProfile} from './register_social_profile';

const passportFacebook = passport.use('facebook', new FacebookStrategy({
		clientID: config.auth.facebook.clientID,
		clientSecret: config.auth.facebook.clientSecret,
		callbackURL: config.auth.facebook.callbackURL,
		profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name', 'profileUrl'],
		enableProof: true,
		authType: 'reauthenticate'
	},
	async (_accessToken: string, _refreshToken: string, profile: Profile, cb: Function) => {
		return registerSocialProfile(profile, cb, 'facebook');
	}
));

// serialize user into the session
init();

export {
	passportFacebook
}
