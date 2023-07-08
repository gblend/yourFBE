import passport from 'passport';
import { Profile, Strategy as FacebookStrategy } from 'passport-facebook';

import { config } from '../config/config';
import init from './init';
import { registerSocialProfile } from './register_social_profile';

export const passportFacebook = passport.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: config.auth.facebook.clientID,
      clientSecret: config.auth.facebook.clientSecret,
      callbackURL: config.auth.facebook.callbackURL,
      profileFields: [
        'id',
        'displayName',
        'photos',
        'email',
        'gender',
        'name',
        'profileUrl',
      ],
      enableProof: true,
      authType: 'reauthenticate',
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      cb: (...args: any) => any,
    ) => {
      return registerSocialProfile(profile, cb, 'facebook');
    },
  ),
);

// serialize user into the session
init();
