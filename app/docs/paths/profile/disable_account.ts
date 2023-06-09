export default {
    '/users/accounts/moderate/{id}': {
        delete: {
            tags: ['Profile'],
            description: 'Disable account',
            summary: 'deactivates user\'s account',
            operationId: 'disableAccount',
            security: [{
                bearerAuth: []
            }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'User id',
                    required: true,
                    type: 'string',
                    example: '63d99f09b014d76af46123f0'
                }
            ],
            responses: {
                '200': {
                    description: 'Disable account successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Account disabled successfully',
                                data: {}
                            }
                        }
                    }
                },
                '404': {
                    description: 'Disable account failed response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'Request failed.',
                                data: {
                                    errors: [
                                        'No resource found with id: 62a07768d969f07ccc3b169'
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
