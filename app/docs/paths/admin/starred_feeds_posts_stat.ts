import partials from '../partials';

export default {
    '/saved-for-later/posts/all/stats': {
        get: {
            tags: ['Admin'],
            description: 'Starred feeds posts stats',
            summary: 'Retrieves user starred feeds posts stats',
            operationId: 'starredFeedsPostsStats',
            security: [{
                bearerAuth: []
            }],
            responses: {
                '200': {
                    description: 'Starred feeds posts stats successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'All starred feed posts stats fetched successfully',
                                data: {
                                    'starredFeedPostsStats': [
                                        {
                                            _id: '62b872c5c9632337442953e3',
                                            post: {
                                                title: 'Second default post title',
                                                summary: 'This is the second default post title',
                                                logoUrl: '`second default logo url',
                                                url: 'second post url'
                                            },
                                            status: 'enabled',
                                            user: '629fc2e6e4c459df61f2b1ad',
                                            feed: {
                                                _id: '62b4787cf9ca61b85b0d12ef',
                                                url: 'https://rss.art19.com/apology-line',
                                                title: 'The Apology Line',
                                                status: 'enabled',
                                                description: 'Learning the act of apology',
                                                logoUrl: 'https://content.production.cdn.art19.com/images/be/e1/82/c2/bee182c2-14b7-491b-b877.jpeg',
                                                category: '62b475d26f14165de5a7cfff',
                                                user: '629fc2e6e4c459df61f2b1ad',
                                                createdAt: '2022-06-23T14:28:12.246Z',
                                                updatedAt: '2022-06-23T20:01:40.002Z',
                                                __v: 0
                                            },
                                            createdAt: '2022-06-26T14:52:53.310Z',
                                            updatedAt: '2022-06-26T14:52:53.310Z',
                                            __v: 0,
                                            postsCount: 3
                                        },
                                        {
                                            _id: '62b8827c7d616658494d9e7d',
                                            post: {
                                                title: 'Second default post title',
                                                summary: 'This is the second default post title',
                                                logoUrl: 'second default logo url',
                                                url: 'second post url'
                                            },
                                            status: 'enabled',
                                            user: '629fc2e6e4c459df61f2b1ad',
                                            feed: {
                                                _id: '62b49bb9339768f1775c7d7a',
                                                url: 'http://rss.art19.com/the-daily',
                                                title: 'The Daily by The New York Times',
                                                status: 'enabled',
                                                description: 'The biggest stories of our time, told by the best journalists in the world',
                                                logoUrl: 'https://rss.com/blog/wp-content/uploads/2018/06/most-popular-rss-feeds-daily-by-new.jpg',
                                                category: '62b475d26f14165de5a7cfff',
                                                user: '629fc2e6e4c459df61f2b1ad',
                                                createdAt: '2022-06-23T16:58:33.888Z',
                                                updatedAt: '2022-06-23T20:01:40.002Z',
                                                __v: 0
                                            },
                                            createdAt: '2022-06-26T15:59:56.660Z',
                                            updatedAt: '2022-06-26T15:59:56.660Z',
                                            __v: 0,
                                            postsCount: 2
                                        }
                                    ],
                                    pagination: partials.pagination
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'Starred feeds posts stat not found',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'Request failed.',
                                data: {
                                    errors: [
                                        'No starred feed posts found'
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
