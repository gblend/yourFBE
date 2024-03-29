import {
  Profile as FacebookProfile,
  Strategy as FacebookStrategy,
} from 'passport-facebook';
import {
  Profile as GoogleProfile,
  Strategy as GoogleStrategy,
} from 'passport-google-oauth20';
import {
  Profile as TwitterProfile,
  Strategy as TwitterStrategy,
} from 'passport-twitter';
import { config } from '../../config/config';
import { registerSocialProfile } from '../../socialauth';
import { CustomAPIError } from '../errors';
import passport from 'passport';

/*
  Get passport strategy
  @param name the strategy name to retrieve
  @return passport
 */
export const getStrategy = (name: string = ''): any => {
  if (!config.app.enabledEnv) {
    return import('passport-mock-strategy').then((mockStrategy) => {
      const MockStrategy = mockStrategy.default;
      return passport.use(new MockStrategy());
    });
  }

  let options: any = {};
  let _Strategy: any = null;
  const verify = async (
    _accessToken: string,
    _refreshToken: string,
    profile: FacebookProfile | GoogleProfile | TwitterProfile,
    cb: (...args: any) => any,
  ): Promise<any> => {
    return registerSocialProfile(profile, cb, name);
  };

  switch (name) {
    case 'facebook':
      _Strategy = FacebookStrategy;
      options = {
        clientID: config.auth[name].clientID,
        clientSecret: config.auth[name].clientSecret,
        callbackURL: config.auth[name].callbackURL,
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
      };
      break;
    case 'google':
      _Strategy = GoogleStrategy;
      options = {
        clientID: config.auth[name].clientID,
        clientSecret: config.auth[name].clientSecret,
        callbackURL: config.auth[name].callbackURL,
      };
      break;
    case 'twitter':
      _Strategy = TwitterStrategy;
      options = {
        consumerKey: config.auth[name].consumerKey,
        consumerSecret: config.auth[name].consumerSecret,
        callbackURL: config.auth[name].callbackURL,
      };
      break;
    default:
      throw new CustomAPIError('Strategy not implemented');
  }

  return passport.use(name, new _Strategy(options, verify));
};
