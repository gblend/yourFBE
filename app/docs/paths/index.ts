import healthEndpoints from './health/status';
import authEndpoints from './auth';
import adminDashboardEndpoints from './admin';
import profileEndpoints from './profile';
import postsEndpoints from './post';

export default {
    paths: {
        ...healthEndpoints,
        ...authEndpoints,
        ...profileEndpoints,
        ...adminDashboardEndpoints,
        ...postsEndpoints,
    }
}
