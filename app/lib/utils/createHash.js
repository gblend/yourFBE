const crypto = require('crypto');

module.exports = (value) => {
	if (value) {
		return crypto.createHash('sha256').update(value).digest('hex');
	}

	return value;
};
