import nock from 'nock';
import { config } from '../constants';

export default {
  resendVerificationEmailSuccess: (payload: { email: string }) => {
    const uri = '/api/v1/auth/resend-verification-email';

    nock(config.base_url).post(uri, payload).reply(200, {
      status: 'success',
      message: 'verification email sent',
      data: {},
    });
  },

  resendVerificationEmailFail: (payload: { email: string }) => {
    const uri = '/api/v1/auth/resend-verification-email';

    nock(config.base_url)
      .post(uri, payload)
      .reply(400, {
        status: 'success',
        message: 'verification email sent',
        data: {
          errors: ['verification email failed'],
        },
      });
  },
};
