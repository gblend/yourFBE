import { getStrategy } from '../lib/utils/passport_strategy';
import init from './init';

const name: string = 'facebook';
export const passportFacebook = getStrategy(name);

// serialize user into the session
init();
