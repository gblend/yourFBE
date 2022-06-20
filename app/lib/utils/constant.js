'use strict';

module.exports.constants = {
    auth: {
        INVALID_CREDENTIALS: (name = 'credentials provided') => `Invalid ${name}.`,
        ALREADY_IN_USE: (name) => `${name} 'is already in use.`,
        AUTHENTICATION_INVALID: 'Authentication invalid.',
        SUCCESSFUL: (name) => `${name} successful.`
    }
}
