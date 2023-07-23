import { getStrategy } from '../lib/utils/passport_strategy';
import init from './init';

const name: string = 'google';
export const passportGoogle = getStrategy(name);

// serialize user into the session
init();
