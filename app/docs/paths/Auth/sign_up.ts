export default {
    '/auth/signup': {
        post: {
            tags: ['Authentication'],
            description: 'New user sign up',
            operationId: 'signUp',
            parameters:[],
            requestBody: {
                content:{
                    'application/json': {
                        schema:{
                            $ref:'#/components/schemas/SignupInput'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'New user signup successful response',
                    content: {
                        'application/json':{
                            schema: {
                                $ref: '#/components/schemas/SignupSuccess'
                            },
                        }
                    }
                },
                '400':{
                    description: 'New user signup error response',
                    content:{
                        'application/json':{
                            schema:{
                                $ref:'#/components/schemas/SignupError'
                            }
                        }
                    }
                }
            }
        }
    }
}
