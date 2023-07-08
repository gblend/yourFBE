import passport from 'passport';
import { Profile, Strategy as TwitterStrategy } from 'passport-twitter';

import { config } from '../config/config';
import init from './init';
import { registerSocialProfile } from './register_social_profile';

export const passportTwitter = passport.use(
  'twitter',
  new TwitterStrategy(
    {
      consumerKey: config.auth.twitter.consumerKey,
      consumerSecret: config.auth.twitter.consumerSecret,
      callbackURL: config.auth.twitter.callbackURL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      cb: (...args: any) => any,
    ): Promise<any> => {
      return registerSocialProfile(profile, cb, 'twitter');
    },
  ),
);

// serialize user into the session
init();
