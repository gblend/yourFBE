import healthEndpoints from './health/status';
import authEndpoints from './auth';
import adminDashboardEndpoints from './admin';
import profileEndpoints from './profile';
import postsEndpoints from './post';
import searchEndpoints from './search';
import statsEndpoints from './stat';
import logsEndpoints from './logs';

export default {
    paths: {
        ...healthEndpoints,
        ...authEndpoints,
        ...profileEndpoints,
        ...adminDashboardEndpoints,
        ...postsEndpoints,
        ...searchEndpoints,
        ...statsEndpoints,
        ...logsEndpoints,
    }
}
