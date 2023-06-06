import healthStatus from './health_status';
import auth from './auth';
import profile from './profile';

export default {
    schemas: {
        HealthStatus: healthStatus,
        User: auth.model,
        // auth
        SignupInput: auth.signupInput,
        SignupSuccess: auth.signupSuccess,
        SignupError: auth.signupError,
        VerifyAccountInput: auth.VerifyAccountInput,
        LoginInput: auth.LoginInput,
        SocialLoginInput: auth.SocialLoginInput,
        ForgotPasswordInput: auth.ForgotPasswordInput,
        ResetPasswordInput: auth.ResetPasswordInput,
        // profile
        ChangePasswordInput: profile.ChangePasswordInput,
        UpdateAccountInput: profile.UpdateAccountInput
    },
}
