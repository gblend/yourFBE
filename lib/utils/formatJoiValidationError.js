module.exports.formatValidationError = (error) => {
    return error.details[0].message.split('\"').join('');
}
