'use strict';

const crypto = require('crypto');
const securityKey = crypto.randomBytes(32);
const algorithm = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);

const createHash = (value) => {
	if (value) {
		return crypto.createHash('sha256').update(value).digest('hex');
	}

	return value;
};

const encrypt = (value) => {
	const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
	return  cipher.update(value, 'utf-8', 'hex') + cipher.final('hex');
}

module.exports = {
	createHash,
	encrypt,
}
