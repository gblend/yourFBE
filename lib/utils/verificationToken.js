const crypto = require('crypto');

const generateToken = (size = 40) => {
	if (size === null || size === '' || size < 1) size = 40;
	return crypto.randomBytes(size).toString('hex');
}
module.exports = {
	generateToken
}
