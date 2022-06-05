const {NotFoundError} = require('../../lib/errors');
const {StatusCodes} = require('../../lib/utils');

describe('NotFoundError', () => {
	it('should return not found error', () => {
		const message = 'Resource not found.';
		const notFound = new NotFoundError(message);
		expect(notFound.statusCode).toBe(StatusCodes.NOT_FOUND);
		expect(notFound.message).toBe(message);
	});
});
