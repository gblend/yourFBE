import partials from '../partials';

export default {
    '/users/me': {
        get: {
            tags: ['Profile'],
            description: 'User data (me)',
            summary: 'retrieves more user details',
            operationId: 'userData',
            security: [{
                bearerAuth: []
            }],
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
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
