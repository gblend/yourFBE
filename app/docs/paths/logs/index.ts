import partials from '../partials';

export default {
    '/logs/activity': {
        get: {
            tags: ['Logs'],
            description: 'Get activity logs',
            summary: 'retrieve activity logs',
            operationId: 'activityLogs',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'pageNumber',
                    in: 'query',
                    description: 'Page number of activity log list',
                    type: 'number',
                    example: 1
                },
                {
                    name: 'pageSize',
                    in: 'query',
                    description: 'The number of records to be retrieved',
                    type: 'number',
                    example: 10
                }
            ],
            responses: {
                '200': {
                    description: 'Activity logs successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Activity logs fetched successfully',
                                data: {
                                    logs: [
                                        {
                                            _id: '62b35c71ba7af91ee98e97ee',
                                            action: 'disableConfig: 62b34a8eb5d378221169d1cd - PATCH /disable/62b34a8eb5d378221169d1cd - by admin',
                                            resourceName: 'ConfigData',
                                            user: '629fc2e6e4c459df61f2b1ad',
                                            createdAt: '2022-06-22T18:16:17.177Z',
                                            updatedAt: '2022-06-22T18:16:17.177Z',
                                            __v: 0
                                        },
                                        {
                                            _id: '62b360ec3533a418e92b8bb0',
                                            action: 'disableConfig: 62b34a8eb5d378221169d1cd - PATCH /disable/62b34a8eb5d378221169d1cd - by admin',
                                            resourceName: 'ConfigData',
                                            user: '629fc2e6e4c459df61f2b1ad',
                                            createdAt: '2022-06-22T18:35:24.985Z',
                                            updatedAt: '2022-06-22T18:35:24.985Z',
                                            __v: 0
                                        },
                                    ],
                                    pagination: partials.pagination
                                }
                            }
                        }
                    }
                },

            }
        }
    },
    '/logs/activity/{id}': {
        get: {
            tags: ['Logs'],
            description: 'Get activity log',
            summary: 'retrieve activity log',
            operationId: 'activityLog',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'The id of the log to retrieve',
                    type: 'string',
                    example: '62b35c71ba7af91ee98e97ee'
                },
            ],
            responses: {
                '200': {
                    description: 'Activity log successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Activity log fetched successfully',
                                data: {
                                    logs: [
                                        {
                                            _id: '62b35c71ba7af91ee98e97ee',
                                            action: 'disableConfig: 62b34a8eb5d378221169d1cd - PATCH /disable/62b34a8eb5d378221169d1cd - by admin',
                                            resourceName: 'ConfigData',
                                            user: '629fc2e6e4c459df61f2b1ad',
                                            createdAt: '2022-06-22T18:16:17.177Z',
                                            updatedAt: '2022-06-22T18:16:17.177Z',
                                            __v: 0
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },

            }
        }
    }
}