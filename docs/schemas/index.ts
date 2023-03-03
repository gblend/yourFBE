import healthStatus from './health_status';
import user from './user';

export default {
    schemas: {
        HealthStatus: healthStatus,
        User: user.model,
        SignupInput: user.signupInput
        // other models
    },
}
