export default {
  '/auth/login/social': {
    post: {
      tags: ['Authentication'],
      description: 'User social login',
      summary: 'social auth login',
      operationId: 'socialLogin',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SocialLoginInput',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User social login successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Social login successful.',
                data: {
                  token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYyYWZhZGRiNzFhZTA2NTMzMDc5OGVkMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwNDc2fQ.RcORvSx7NWFKIcs4bD6tt21r0v0J3movo3b2XUAEgno',
                  refreshToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJHYWJyaWVsIElsb2NoaSIsImlkIjoiNjJhZmFkZGI3MWFlMDY1MzMwNzk4ZWQwIiwicm9sZSI6InVzZXIifSwicmVmcmVzaFRva2VuIjoiNmRmMzI0YTM2OGEzOTYwNjdiNWMxNDI3YzM1YTMyYjhjODRlZjBlMDM5YjU5ZTQ4Zjg5YjI0YWVlOWY3ZmJjYWVhMjhiODFlYWI3YjFmMWYiLCJpYXQiOjE2NTU2ODA0Nzd9._j1v5W-i8lYkXX439rFObA1s4h9EuYx6s2rISpH_Xl8',
                  user: {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'johndoe@example.com',
                    role: 'user',
                    gender: 'male',
                    status: 'enabled',
                    socialChannel: 'facebook',
                    socialChannelId: 'xx**xx',
                    avatar: '/uploads/default_avatar.jpeg',
                    verificationToken: 'arh399027ann3m4',
                    isVerified: true,
                    verified: '1970-01-01 01:01:00',
                    lastLogin: '1970-01-01 01:01:00',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'User account disabled error response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed',
                data: {
                  errors: ['Account is disabled. Please contact support.'],
                },
              },
            },
          },
        },
      },
    },
  },
};
