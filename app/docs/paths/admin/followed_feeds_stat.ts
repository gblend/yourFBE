import partials from '../partials';

export default {
  '/followed-feeds/stats': {
    get: {
      tags: ['Admin'],
      description: 'Followed feeds stats',
      summary: 'Retrieves users followed feeds stats',
      operationId: 'followedFeedsStats',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'pageNumber',
          in: 'query',
          description: 'Page number of users list',
          type: 'number',
          example: 1,
        },
        {
          name: 'pageSize',
          in: 'query',
          description: 'The number of records to be retrieved',
          type: 'number',
          example: 10,
        },
      ],
      responses: {
        '200': {
          description: 'Followed feeds stats successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: 'All feeds followers stats fetched successfully.',
                data: {
                  feedsFollowersStats: [
                    {
                      _id: '62e98a6859ce0b8e4fb59f32',
                      feed: {
                        _id: '62d88e4254fa85815983b480',
                        url: 'feeds.acast.com/public/shows/5ea17537-f11f-4532-8202-294d976b9d5c',
                        title: 'Unraveled13',
                        status: 'enabled',
                        description: 'This is a test',
                        logoUrl:
                          'https://rss.com/blog/wp-content/uploads/2021/03/best-true-crime-podcasts-unraveled-long-island-serial-killer-e1617729398561.jpg',
                        category: '62b475cc6f14165de5a7cffb',
                        user: '6302a0a8e2041db2f59d6598',
                        createdAt: '2022-07-20T23:22:42.633Z',
                        updatedAt: '2023-06-12T10:30:00.979Z',
                        __v: 0,
                      },
                      user: '62fd10dd927af0a812033cba',
                      createdAt: '2022-08-02T20:34:48.093Z',
                      updatedAt: '2022-08-02T20:34:48.093Z',
                      __v: 0,
                      followersCount: 2,
                    },
                    {
                      _id: '62e7167b6b0fb320a82de3ec',
                      feed: {
                        _id: '62d8e93454fa85815983b48a',
                        url: 'https://rss.art19.com/apology-line',
                        title: 'The Apology Line',
                        status: 'enabled',
                        description:
                          'Long Island Serial Killer is a search for answers in one of the biggest murder mysteries in American history',
                        logoUrl:
                          'https://rss.com/blog/wp-content/uploads/2021/03/best-true-crime-podcasts-unraveled-long-island-serial-killer-e1617729398561.jpg',
                        category: '62b475cc6f14165de5a7cffb',
                        user: '6302a0a8e2041db2f59d6598',
                        createdAt: '2022-07-21T05:50:44.962Z',
                        updatedAt: '2023-06-12T10:30:00.979Z',
                        __v: 0,
                      },
                      user: '62fd10dd927af0a812033cba',
                      createdAt: '2022-07-31T23:55:39.114Z',
                      updatedAt: '2022-07-31T23:55:39.114Z',
                      __v: 0,
                      followersCount: 1,
                    },
                  ],
                  pagination: partials.pagination,
                },
              },
            },
          },
        },
        '404': {
          description: 'Followed feeds stat not found',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed.',
                data: {
                  errors: ['No followed feeds stat found'],
                },
              },
            },
          },
        },
      },
    },
  },
};
