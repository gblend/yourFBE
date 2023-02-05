const constants = {
    auth: {
        INVALID_CREDENTIALS: (name: string = 'credentials provided') => `Invalid ${name}.`,
        ALREADY_IN_USE: (name: string) => `${name} is already in use.`,
        AUTHENTICATION_INVALID: 'Authentication invalid.',
        SUCCESSFUL: (name: string) => `${name} successful.`
    },
    STATUS_ENABLED: 'enabled',
    STATUS_DISABLED: 'disabled',
}

export {
    constants
}
