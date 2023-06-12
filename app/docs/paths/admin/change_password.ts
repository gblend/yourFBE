export default {
    '/users/update-password': {
        patch: {
            tags: ['Admin'],
            description: 'Change account password',
            summary: 'change account password',
            operationId: 'changePassword',
            security: [{
                bearerAuth: []
            }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            newPassword: {
                                type: 'string',
                                required: true
                            },
                            oldPassword: {
                                type: 'string',
                                required: true
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'Change password successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Password was updated successfully',
                                data: {}
                            }
                        }
                    }
                },
                '400': {
                    description: 'Change password failed response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'Request failed.',
                                data: {
                                    errors: [
                                        'New password must not be the same as old password'
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
