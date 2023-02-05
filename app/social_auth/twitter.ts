import passport from 'passport';
import {Strategy as TwitterStrategy, Profile} from 'passport-twitter';

import {config} from '../config/config';
import init from './init';
import {registerSocialProfile} from './register_social_profile';

const passportTwitter = passport.use('twitter', new TwitterStrategy({
		consumerKey: config.auth.twitter.consumerKey,
		consumerSecret: config.auth.twitter.consumerSecret,
		callbackURL: config.auth.twitter.callbackURL,
	},
	async (_accessToken: string, _refreshToken: string, profile: Profile, cb: Function): Promise<any> => {
		return registerSocialProfile(profile, cb, 'twitter');
	}
));

// serialize user into the session
init();

export {
	passportTwitter
}
