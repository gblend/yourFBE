import partials from '../partials';

export default {
  '/users/disabled-accounts': {
    get: {
      tags: ['Admin'],
      description: 'Retrieve list of disabled accounts',
      summary: 'Get disabled accounts',
      operationId: 'disabledAccounts',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'pageSize',
          in: 'query',
          description: 'The number of records per page',
          type: 'number',
          example: 1,
        },
        {
          name: 'pageNumber',
          in: 'query',
          description:
            'The number of the current page for disabled users accounts',
          type: 'string',
          example: 1,
        },
      ],
      responses: {
        '200': {
          description: 'Disabled accounts successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Disabled accounts fetched successfully',
                data: {
                  users: [
                    {
                      _id: '63d99f09b014d76af46123f0',
                      firstname: 'John',
                      lastname: 'Doe',
                      email: 'johndoenew@example.com',
                      role: 'user',
                      gender: 'NA',
                      status: 'disabled',
                      avatar: '/uploads/default_avatar.jpeg',
                      isVerified: false,
                      createdAt: '2023-01-31T23:06:49.460Z',
                      updatedAt: '2023-03-29T01:02:35.200Z',
                      __v: 0,
                      lastLogin: '2023-01-31T23:21:47.089Z',
                      id: '63d99f09b014d76af46123f0',
                    },
                  ],
                  pagination: partials.pagination,
                },
              },
            },
          },
        },
        '404': {
          description: 'Disabled account not found response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed.',
                data: {
                  errors: ['No disabled account found'],
                },
              },
            },
          },
        },
        '401': {
          description: 'Disabled account unauthorized response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed.',
                data: {
                  errors: ['You are not authorized to access this resource'],
                },
              },
            },
          },
        },
      },
    },
  },
};
