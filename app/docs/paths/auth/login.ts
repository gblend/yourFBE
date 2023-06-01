export default {
    '/auth/login': {
        post: {
            tags: ['Authentication'],
            description: 'User login',
            operationId: 'login',
            parameters:[],
            requestBody: {
                content:{
                    'application/json': {
                        schema:{
                            $ref:'#/components/schemas/LoginInput'
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User login successful response',
                    content: {
                        'application/json': {
                            example: {
                                status: 'success',
                                message: 'Login successful.',
                                data: {
                                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYyYWZhZGRiNzFhZTA2NTMzMDc5OGVkMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwNDc2fQ.RcORvSx7NWFKIcs4bD6tt21r0v0J3movo3b2XUAEgno',
                                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJHYWJyaWVsIElsb2NoaSIsImlkIjoiNjJhZmFkZGI3MWFlMDY1MzMwNzk4ZWQwIiwicm9sZSI6InVzZXIifSwicmVmcmVzaFRva2VuIjoiNmRmMzI0YTM2OGEzOTYwNjdiNWMxNDI3YzM1YTMyYjhjODRlZjBlMDM5YjU5ZTQ4Zjg5YjI0YWVlOWY3ZmJjYWVhMjhiODFlYWI3YjFmMWYiLCJpYXQiOjE2NTU2ODA0Nzd9._j1v5W-i8lYkXX439rFObA1s4h9EuYx6s2rISpH_Xl8',
                                    user: {
                                        firstname: 'John',
                                        lastname: 'Doe',
                                        email: 'johndoe@example.com',
                                        role: 'user',
                                        gender: 'male',
                                        status: 'enabled',
                                        socialChannel: 'facebook',
                                        socialChannelId: 'xx**xx',
                                        avatar: '/uploads/default_avatar.jpeg',
                                        verificationToken: 'arh399027ann3m4',
                                        isVerified: true,
                                        verified: '1970-01-01 01:01:00',
                                        lastLogin: '1970-01-01 01:01:00'
                                    }
                                }
                            }
                        }
                    }
                },
                '400': {
                    description: 'User login error response',
                    content:{
                        'application/json':{
                            example: {
                                status: 'error',
                                message: 'Request failed',
                                data: {
                                    errors: ['Invalid email or password.']
                                }
                            }
                        }
                    }
                },
                '401': {
                    description: 'User account disabled error response',
                    content:{
                        'application/json':{
                            example: {
                                status: 'error',
                                message: 'Request failed',
                                data: {
                                    errors: ['Account is disabled. Please contact support.']
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
