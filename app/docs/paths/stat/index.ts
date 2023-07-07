export default {
  '/stats/users/{id}': {
    get: {
      tags: ['Stats'],
      description: 'Get user activity stats',
      summary: 'get user activity stats',
      operationId: 'userStats',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'The user id to retrieve their stats',
          type: 'string',
          example: '629fc2e6e4c459df61f2b1ad',
        },
      ],
      responses: {
        '200': {
          description: 'User stats successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Stats fetched successfully',
                data: {
                  stats: {
                    totalFollowedFeed: 0,
                    totalFollowedFeedCategory: 0,
                    totalSavedForLater: 6,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/stats/admin': {
    get: {
      tags: ['Stats'],
      description: 'Get admin dashboard stats',
      summary: 'get admin dashboard stats',
      operationId: 'adminStats',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Admin stats successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'Stats fetched successfully',
                data: {
                  stats: {
                    totalFeed: 12,
                    totalFeedFollows: 8,
                    totalCategory: 5,
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
