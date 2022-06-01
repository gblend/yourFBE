const crypto = require('crypto');
const defaultSize = 40;

const generateToken = (size = defaultSize) => {
	if (size === null || size === '' || size < 1) size = defaultSize;
	return crypto.randomBytes(size).toString('hex');
}
module.exports = {
	generateToken
}
