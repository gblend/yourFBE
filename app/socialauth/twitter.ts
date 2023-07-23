import passport from 'passport';
import init from './init';
import { getStrategy } from '../lib/utils/passport_strategy';

const name: string = 'twitter';
export const passportTwitter = passport.use(name, getStrategy(name));

// serialize user into the session
init();
