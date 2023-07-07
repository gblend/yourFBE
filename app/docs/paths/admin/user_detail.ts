import partials from '../partials';

export default {
  '/users/{id}': {
    get: {
      tags: ['Admin'],
      description: 'Profile details',
      summary: 'retrieves logged in user details',
      operationId: 'profileDetails',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'User id',
          required: true,
          type: 'string',
          example: '63d99f09b014d76af46123f0',
        },
      ],
      responses: {
        '200': {
          description: 'User profile details successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Account details fetched successfully',
                data: {
                  user: partials.authUser,
                },
              },
            },
          },
        },
      },
    },
  },
};
