import partials from '../partials';

export default {
    '/users': {
        get: {
            tags: ['Admin'],
            description: 'Users',
            summary: 'retrieves registered users list',
            operationId: 'users',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'pageNumber',
                    in: 'query',
                    description: 'Page number of users list',
                    type: 'number',
                    example: 1
                },
                {
                    name: 'pageSize',
                    in: 'query',
                    description: 'The number of records to be retrieved',
                    type: 'number',
                    example: 10
                },
                {
                    name: 'sort',
                    in: 'query',
                    description: 'The fields to sort the document by',
                    type: 'string',
                    example: 'firstname'
                }
            ],
            responses: {
                '200': {
                    description: 'Registered users list successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Account details fetched successfully',
                                data: {
                                    users: [partials.authUser],
                                    pagination: partials.pagination
                                }
                            }
                        }
                    }
                },
                '403': {
                    description: 'Users list access forbidden',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'Request failed',
                                data: {
                                    errors: [
                                        'You are not authorized to access this resource'
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