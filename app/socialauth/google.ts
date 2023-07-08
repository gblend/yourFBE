import passport from 'passport';
import { Profile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/config';
import init from './init';
import { registerSocialProfile } from './register_social_profile';

export const passportGoogle = passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: config.auth.google.clientID,
      clientSecret: config.auth.google.clientSecret,
      callbackURL: config.auth.google.callbackURL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      cb: (...args: any) => any,
    ) => {
      return registerSocialProfile(profile, cb, 'google');
    },
  ),
);

// serialize user into the session
init();
