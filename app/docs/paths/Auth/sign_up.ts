export default {
    '/auth/signup': {
        post: {
            tags: ['Authentication Operations'],
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
            responses:{
                '200':{
                    description:"Todo is obtained",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:"#/components/schemas/Todo"
                            }
                        }
                    }
                },
                '404':{
                    description: "Todo is not found",
                    content:{
                        'application/json':{
                            schema:{
                                $ref:'#/components/schemas/Error',
                                example:{
                                    message:"We can't find the todo",
                                    internal_code:"Invalid id"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
