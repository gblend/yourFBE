export default {
    model: {
        type: 'object',
        properties: {
            firstname: {
                type: 'string',
                description: 'The user first name',
                required: true,
                example: 'John'
            },
            lastname: {
                type: 'string',
                required: true,
                description: 'The user last name',
                example: 'Doe'
            },
            email: {
                type: 'string',
                required: true,
                description: 'The user email address',
                example: 'johndoe@gmail.com'
            },
            password: {
                type: 'string',
                required: true,
                description: 'The user password',
                example: 'xx**xx22@@'
            },
            passwordConfirmation: {
                type: 'string',
                required: true,
                description: 'The user password confirmation',
                example: 'xx**xx22@@'
            },
            role: {
                type: 'string',
                description: 'The user role',
                example: 'admin'
            },
            gender: {
                type: 'string',
                description: 'The user gender',
                example: 'male'
            },
            status: {
                type: 'string',
                description: 'The user account status',
                example: 'enabled'
            },
            socialChannel: {
                type: 'string',
                description: 'The user registration social channel',
                example: 'facebook'
            },
            socialChannelId: {
                type: 'string',
                description: 'The user registration social channel',
                example: 'xx**xx'
            },
            avatar: {
                type: 'string',
                description: 'The user profile image url',
                example: '/uploads/default_avatar.jpeg',
            },
            verificationToken: {
                type: 'string',
                description: 'The user account verification token',
                example: 'arh399027ann3m4'
            },
            isVerified: {
                type: 'boolean',
                description: 'The user account verification status',
                example: true
            },
            verified: {
                type: 'date',
                description: 'The user account verification date',
                example: '1970-01-01 01:01:00'
            },
            lastLogin: {
                type: 'date',
                description: 'The user last login date',
                example: '1970-01-01 01:01:00'
            },
            passwordToken: {
                type: 'string',
                description: 'The user account verification password token',
                example: 'arh399027ann3m4'
            },
            passwordTokenExpirationDate: {
                type: 'date',
                description: 'The user account verification password token expiration date',
                example: '1970-01-01 01:01:00'
            },
        },
    },
    signupInput: {
        type: 'object',
        properties: {
            firstname: {
                type: 'string',
                description: 'The user first name',
                required: true,
                example: 'John'
            },
            lastname: {
                type: 'string',
                required: true,
                description: 'The user last name',
                example: 'Doe'
            },
            email: {
                type: 'string',
                required: true,
                description: 'The user email address',
                example: 'johndoe@gmail.com'
            },
            password: {
                type: 'string',
                required: true,
                description: 'The user password',
                example: 'xx**xx22@@'
            },
            passwordConfirmation: {
                type: 'string',
                required: true,
                description: 'The user password confirmation',
                example: 'xx**xx22@@'
            },
        }
    },
    signupSuccess: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                description: 'The request status',
                example: 'success'
            },
            message: {
                type: 'string',
                description: 'The response message',
                example: 'Please check your email for a link to verify your account'
            },
            data: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        description: 'The signup token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYyYWZhZGRiNzFhZTA2NTMzMDc5OGVkMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwNDc2fQ.RcORvSx7NWFKIcs4bD6tt21r0v0J3movo3b2XUAEgno',
                    },
                    refreshToken: {
                        type: 'string',
                        description: 'The signup refresh token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJHYWJyaWVsIElsb2NoaSIsImlkIjoiNjJhZmFkZGI3MWFlMDY1MzMwNzk4ZWQwIiwicm9sZSI6InVzZXIifSwicmVmcmVzaFRva2VuIjoiNmRmMzI0YTM2OGEzOTYwNjdiNWMxNDI3YzM1YTMyYjhjODRlZjBlMDM5YjU5ZTQ4Zjg5YjI0YWVlOWY3ZmJjYWVhMjhiODFlYWI3YjFmMWYiLCJpYXQiOjE2NTU2ODA0Nzd9._j1v5W-i8lYkXX439rFObA1s4h9EuYx6s2rISpH_Xl8',
                    },
                    user: {
                        type: 'object',
                        properties: {
                            firstname: {
                                type: 'string',
                                description: 'The user first name',
                                required: true,
                                example: 'John'
                            },
                            lastname: {
                                type: 'string',
                                required: true,
                                description: 'The user last name',
                                example: 'Doe'
                            },
                            email: {
                                type: 'string',
                                required: true,
                                description: 'The user email address',
                                example: 'johndoe@gmail.com'
                            },
                            role: {
                                type: 'string',
                                description: 'The user role',
                                example: 'admin'
                            },
                            gender: {
                                type: 'string',
                                description: 'The user gender',
                                example: 'male'
                            },
                            status: {
                                type: 'string',
                                description: 'The user account status',
                                example: 'enabled'
                            },
                            socialChannel: {
                                type: 'string',
                                description: 'The user registration social channel',
                                example: 'facebook'
                            },
                            socialChannelId: {
                                type: 'string',
                                description: 'The user registration social channel',
                                example: 'xx**xx'
                            },
                            avatar: {
                                type: 'string',
                                description: 'The user profile image url',
                                example: '/uploads/default_avatar.jpeg',
                            },
                            verificationToken: {
                                type: 'string',
                                description: 'The user account verification token',
                                example: 'arh399027ann3m4'
                            },
                            isVerified: {
                                type: 'boolean',
                                description: 'The user account verification status',
                                example: true
                            },
                            verified: {
                                type: 'date',
                                description: 'The user account verification date',
                                example: '1970-01-01 01:01:00'
                            },
                            lastLogin: {
                                type: 'date',
                                description: 'The user last login date',
                                example: '1970-01-01 01:01:00'
                            }
                        },
                    }
                }
            }
        }
    },
    signupError: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                description: 'The request status',
                example: 'error'
            },
            message: {
                type: 'string',
                description: 'The response message',
                example: 'Request failed'
            },
            data: {
                type: 'object',
                properties: {
                    errors: {
                        type: 'array',
                        example: ['Email address is already in use.']
                    }
                }
            }
        }
    },
    VerifyAccountInput: {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                description: 'Account verification token',
                example: 'fcc0ac4edd239d804ba6586a727c609fd27321e9ee3ec3a2fe1f285c1a7936082b31d74b58bbbee8'
            },
            email: {
                type: 'string',
                description: 'Account email address',
                example: 'johndoe@example.com'
            }
        }
    },
    LoginInput: {
        type: 'object',
        properties: {
            password: {
                type: 'string',
                description: 'Account password',
                example: '**********'
            },
            email: {
                type: 'string',
                description: 'Account email address',
                example: 'johndoe@example.com'
            }
        }
    },
    SocialLoginInput: {
        type: 'object',
        properties: {
            profileData: {
                type: 'object',
                properties: {
                    provider: {
                        type: 'string',
                        description: 'Social login provider title',
                        example: 'twitter'
                    },
                    id: {
                        type: 'string',
                        description: 'Social login provider id',
                        example: '633563540'
                    },
                    gender: {
                        type: 'string',
                        description: 'Social login user gender',
                        example: 'NA'
                    },
                    name: {
                        type: 'string',
                        description: 'Social login user name',
                        example: 'John Doe'
                    },
                    firstname: {
                        type: 'string',
                        description: 'Social login user first name',
                        example: 'John'
                    },
                    lastname: {
                        type: 'string',
                        description: 'Social login user last name',
                        example: 'Doe'
                    },
                    picture: {
                        type: 'string',
                        description: 'Social login user profile image url',
                        example: 'https://default.png'
                    },
                    email: {
                        type: 'string',
                        description: 'Social login user email address',
                        example: 'johndoe@example.com'
                    },
                    email_verified: {
                        type: 'boolean',
                        description: 'Whether social login user email is verified',
                        example: true
                    }
                }
            },
            updateProfile: {
                type: 'boolean',
                description: 'Whether profile should be updated if it already exists',
                example: true
            }
        }
    },
    ForgotPasswordInput: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                required: true,
                description: 'Account email address',
                example: 'johndoe@example.com'
            }
        }
    },
    ResetPasswordInput: {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                required: true,
                description: 'Account email address',
                example: 'johndoe@example.com'
            },
            token: {
                type: 'string',
                required: true,
                description: 'The signup token',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR2FicmllbCBJbG9jaGkiLCJpZCI6IjYyYWZhZGRiNzFhZTA2NTMzMDc5OGVkMCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NjgwNDc2fQ.RcORvSx7NWFKIcs4bD6tt21r0v0J3movo3b2XUAEgno',
            },
            password: {
                type: 'string',
                required: true,
                description: 'Account password',
                example: '**********'
            }
        }
    }
}
