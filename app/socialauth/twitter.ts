import { getStrategy } from '../lib/utils/passport_strategy';
import init from './init';

const name: string = 'twitter';
export const passportTwitter = getStrategy(name);

// serialize user into the session
init();
