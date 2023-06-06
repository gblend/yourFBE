export default {
    '/auth/reset-password': {
        post: {
            tags: ['Authentication'],
            description: 'Reset password',
            summary: 'resets user\'s account password',
            operationId: 'resetPassword',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ResetPasswordInput'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User reset password successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Password changed successfully.',
                                data: {}
                            }
                        }
                    }
                },
                '400': {
                    description: 'User reset password error response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'error',
                                message: 'Request failed',
                                data: {
                                    errors: ['Password reset link has expired']
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
