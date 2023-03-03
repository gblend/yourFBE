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
    }
}
