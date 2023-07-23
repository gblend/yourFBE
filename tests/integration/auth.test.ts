import { tearDownTestConnection } from '../helpers/connection_teardown';
import { connection } from 'mongoose';
import appServer from '../../server';
import Joi from 'joi';
import { decrypt } from '../../app/lib/utils';
import { User } from '../../app/models';
import supertest from 'supertest';
const request = supertest(appServer);
import { IUser } from '../../app/interface';

describe.skip('auth', () => {
  interface ITestData {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    token?: string;
  }

  interface ITestUser extends IUser {
    user?: any;
    data?: any;
  }

  let testUser: ITestUser = {};
  let data: ITestData = {};
  let socialProfile: any = {};
  let loginTokens: string[] = [];
  let verificationToken: string = '';

  beforeEach(() => {
    data = {
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    };
  });

  afterAll(async () => {
    await tearDownTestConnection();
  });

  it('should successfully register a user', (done) => {
    expect(Object.keys(connection.models).length).toBeGreaterThan(0);

    request
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        testUser = response.body;

        const registeredUser = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            token: Joi.string().required(),
            refreshToken: Joi.string().required(),
            user: Joi.object({
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              role: Joi.string().required(),
              gender: Joi.string().required(),
              status: Joi.string().required(),
              avatar: Joi.string().required(),
              verificationToken: Joi.string().required(),
              isVerified: Joi.boolean().required(),
              createdAt: Joi.date().required(),
              updatedAt: Joi.date().required(),
            }).options({ allowUnknown: true }),
          }),
        });

        Joi.assert(testUser, registeredUser);
      })
      .end(done);
  });

  it('should fail registration due to duplicate email', (done) => {
    request
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res: any) => {
        const registrationError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(res.body, registrationError);
      })
      .end(done);
  });

  it('should fail registration due to incomplete parameters', (done) => {
    request
      .post('/api/v1/auth/signup')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((res: any) => {
        const registrationError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(res.body, registrationError);
      })
      .end(done);
  });

  it('should successfully login a user with valid credentials', (done) => {
    data = {
      email: 'test@example.com',
      password: 'password',
    };

    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        loginTokens = response.headers['set-cookie'];

        const loggedInUser = Joi.object({
          status: testUser.status,
          message: Joi.string().required(),
          data: Joi.object({
            verificationMsg: Joi.string().required(),
            token: Joi.string().required(),
            refreshToken: Joi.string().required(),
            user: Joi.object(testUser.user).options({ allowUnknown: true }),
          }),
        });

        Joi.assert(response.body, loggedInUser);
      })
      .end(done);
  });

  it('should fail to login with invalid parameters', (done) => {
    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should fail to login with invalid email', (done) => {
    data = {
      email: 'test@example1.com',
      password: 'password',
    };

    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should fail to login with invalid password', (done) => {
    data = {
      email: 'test@example.com',
      password: 'password1',
    };

    request
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should successfully logout user with valid token', (done) => {
    request
      .delete('/api/v1/auth/logout')
      .set('Cookie', loginTokens)
      .expect(204)
      .expect((response: any) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });

  it('should fail to logout user with invalid token', (done) => {
    request
      .delete('/api/v1/auth/logout')
      .set('Cookie', [])
      .expect(401)
      .expect((response: any) => {
        const loginError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, loginError);
      })
      .end(done);
  });

  it('should initiate forgot password for provided email', (done) => {
    request
      .post('/api/v1/auth/forgot-password')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@example.com' })
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const forgotPasswordSchema = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({}).required(),
        });

        Joi.assert(response.body, forgotPasswordSchema);
      })
      .end(done);
  });

  it('should fail to initiate forgot password with invalid email', (done) => {
    request
      .post('/api/v1/auth/forgot-password')
      .set('Content-Type', 'application/json')
      .send({ email: '' })
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect((response: any) => {
        const forgotPasswordSchema = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1).required(),
          }),
        });

        Joi.assert(response.body, forgotPasswordSchema);
      })
      .end(done);
  });

  it('should successfully reset password with email, token and password', async () => {
    const {
      body: {
        data: { user },
      },
    } = await request
      .get(`/api/v1/users/${testUser.data.user._id}`)
      .set('Cookie', loginTokens)
      .set('Content-Type', 'application/json')
      .expect(200);

    data = {
      email: user.email,
      token: decrypt(user.passwordToken),
      password: 'new password',
    };

    const response = await request
      .post('/api/v1/auth/reset-password')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const resetPasswordSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({}).required(),
    });

    Joi.assert(response.body, resetPasswordSchema);
  });

  it('should fail to reset password with invalid parameters', async () => {
    const res = await request
      .post('/api/v1/auth/reset-password')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const resetPasswordError = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(res.body, resetPasswordError);
  });

  it('should fail to reset password with unregistered email', async () => {
    data = {
      email: 'test@example1.com',
      token: 'xxx9-8000-99088657-rexx',
      password: 'new password',
    };

    const res = await request
      .post('/api/v1/auth/reset-password')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const resetPasswordError = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(res.body, resetPasswordError);
  });

  it('should fail to reset password with invalid token', async () => {
    data = {
      email: 'test@example.com',
      token: 'xx-8000-99088657-xx',
      password: 'new password',
    };

    const result = await request
      .post('/api/v1/auth/reset-password')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400);

    const resetPasswordError = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(result.body, resetPasswordError);
  });

  it('should successfully verify user with valid email and token', async () => {
    const user = await User.findOne({ _id: testUser.data.user._id });
    verificationToken = user?.verificationToken ?? '';

    data = {
      email: user?.email,
      token: verificationToken,
    };

    const res = await request
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const verifyEmailSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({}).required(),
    });

    Joi.assert(res.body, verifyEmailSchema);
  });

  it('should fail to verify user with invalid email', async () => {
    data = {
      email: 'test@example1.com',
      token: verificationToken,
    };

    const response = await request
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect(401)
      .expect('Content-Type', 'application/json; charset=utf-8');

    const verifyEmailErrorSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(response.body, verifyEmailErrorSchema);
  });

  it('should fail to verify user with invalid token', async () => {
    data = {
      email: testUser.data.user.email,
      token: verificationToken,
    };

    const res = await request
      .post('/api/v1/auth/verify-account')
      .set('Content-Type', 'application/json')
      .send(data)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401);

    const verifyEmailErrorSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        errors: Joi.array().min(1).required(),
      }),
    });

    Joi.assert(res.body, verifyEmailErrorSchema);
  });

  it('should return social login error', async () => {
    const response = await request
      .get('/api/v1/auth//social-error')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400);

    const socialLoginErrorSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({}),
    });

    Joi.assert(response.body, socialLoginErrorSchema);
  });

  it('should register social profile with valid parameters', async () => {
    socialProfile = {
      profileData: {
        provider: 'test',
        id: '633563540',
        gender: null,
        name: 'Test User',
        firstname: 'Test',
        lastname: 'User',
        picture: 'http://default.png',
        email: 'socialtest@example.com',
        email_verified: false,
      },
      updateProfile: true,
    };

    const res = await request
      .post('/api/v1/auth/login/social')
      .set('Content-Type', 'application/json')
      .send(socialProfile)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200);

    const socialLoginSchema = Joi.object({
      status: Joi.string().required(),
      message: Joi.string().required(),
      data: Joi.object({
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        user: Joi.object({
          socialChannelId: socialProfile.profileData.id,
          firstname: socialProfile.profileData.firstname,
          lastname: socialProfile.profileData.lastname,
          email: socialProfile.profileData.email,
          role: Joi.string().required(),
          gender: Joi.string().required().allow(null),
          status: Joi.string().required(),
          avatar: socialProfile.profileData.picture,
          socialChannel: socialProfile.profileData.provider,
          isVerified: Joi.boolean().required(),
          createdAt: Joi.date().required(),
          updatedAt: Joi.date().required(),
        }).options({ allowUnknown: true }),
      }),
    });

    Joi.assert(res.body, socialLoginSchema);
  });

  it('should resend verification email to user', (done) => {
    request
      .post('/api/v1/auth/resend-verification-email')
      .set('Content-Type', 'application/json')
      .set('Cookie', loginTokens)
      .send({ email: data.email })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .expect((_result: any) => {
        const resendVerificationEmail = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({}),
        });

        Joi.assert(_result.body, resendVerificationEmail);
      })
      .end(done);
  });

  it('should fail to resend verification email with invalid user token', async () => {
    request
      .delete('/api/v1/auth/logout')
      .set('Cookie', loginTokens)
      .then(async () => {
        const result = await request
          .post('/api/v1/auth/resend-verification-email')
          .set('Content-Type', 'application/json')
          .send({ email: '' });

        const resendVerificationEmailError = Joi.object({
          status: Joi.string().required(),
          message: Joi.string().required(),
          data: Joi.object({
            errors: Joi.array().min(1),
          }),
        });

        Joi.assert(result.body, resendVerificationEmailError);
      });
  });
});
