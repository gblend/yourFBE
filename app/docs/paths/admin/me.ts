import partials from '../partials';

export default {
  '/users/me/unused': {
    get: {
      tags: ['Admin'],
      description: 'User data (me)',
      summary: 'Retrieves more user details',
      operationId: 'adminDashboard',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'User data successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Account details fetched successfully',
                data: {
                  user: {
                    ...partials.authUser,
                    savedForLater: [],
                    followedFeeds: [],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
