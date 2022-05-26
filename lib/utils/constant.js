module.exports.constants =  {
    auth: {
       invalidCredentials: (name='credentials provided') => `Invalid ${name}.`,
        alreadyInUse: (name) => `${name} 'is already in use.`,
        successful: (name) => `${name} successful.`
    }
}
