module.exports.formatValidationError = ({ details }) => {
    return details.map(detail => {
        if (detail.message) {
            return detail.message.split('\"').join('')
        }
        return detail.message;
    });
}
