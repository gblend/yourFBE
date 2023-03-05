export default {
    '/auth/resend-verification-email': {
        post: {
            tags: ['Authentication'],
            description: 'Resend account verification email',
            operationId: 'resendAccountVerificationEmail',
            parameters:[],
            requestBody: {
                content:{
                    'application/json': {}
                }
            },
            responses: {
                '200': {
                    description: 'Successful resend account verification email response',
                    content: {
                        'application/json':{
                            example: {
                                status: 'success',
                                message: 'Please check your email for a link to verify your account',
                                data: {}
                            },
                        }
                    }
                },
                '404':{
                    description: 'Unauthorized resend account verification email error response',
                    content:{
                        'application/json':{
                            example: {
                                status: 'success',
                                message: 'Request failed',
                                data: {
                                    errors: [
                                        'Request to resend account verification email failed, account not found'
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
