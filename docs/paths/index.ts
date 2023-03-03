import healthEndpoints from './Health';
import authEndpoints from './Auth';

export default {
    paths: {
        ...healthEndpoints,
        ...authEndpoints
    }
}
