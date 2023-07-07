import signUp from './sign_up';
import verifyAccount from './verify_account';
import login from './login';
import socialLogin from './social_login';
import logout from './logout';
import forgotPassword from './forgot_password';
import resetPassword from './reset_password';
import resendAccountVerificationEmail from './resend_verify_account';

export default {
  ...verifyAccount,
  ...login,
  ...socialLogin,
  ...forgotPassword,
  ...logout,
  ...resetPassword,
  ...resendAccountVerificationEmail,
  ...signUp,
};
