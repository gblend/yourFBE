export default {
    '/auth/forgot-password': {
        post: {
            tags: ['Authentication'],
            description: 'Forgot password',
            operationId: 'forgotPassword',
            parameters:[],
            requestBody: {
                content:{
                    'application/json': {
                        schema:{
                            $ref:'#/components/schemas/ForgotPasswordInput'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User forgot password successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Please check your email for reset link',
                                data: {}
                            }
                        }
                    }
                }
            }
        }
    }
}
