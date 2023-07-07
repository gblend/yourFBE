export default {
  '/users/update-password': {
    patch: {
      tags: ['Profile'],
      description: 'Change password',
      summary: 'change account password',
      operationId: 'changePassword',
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChangePasswordInput',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User change password successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Password was updated successfully',
                data: {},
              },
            },
          },
        },
        '400': {
          description: 'User change password error response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed',
                data: {
                  errors: ['New password must not be the same as old password'],
                },
              },
            },
          },
        },
      },
    },
  },
};
