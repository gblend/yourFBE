const {adaptRequest} = require('../../app/lib/utils');

describe('AdaptRequest', () => {
	it('should return extracted request object with value as undefined', () => {
		const req = {
			path: undefined,
			method: undefined,
			body: undefined,
			queryParams: undefined,
			pathParams: undefined,
			headers: undefined,
			ip: undefined,
			signedCookies: undefined,
			user: undefined,
			cookies: undefined,
			files: undefined,
		};

		expect(adaptRequest({})).toMatchObject(req);
	});

	it('should return extracted request object', () => {
		const req = {
			path: '/api/v1/status',
			method: 'GET',
			body: {},
			queryParams: {},
			pathParams: {},
			headers: [],
			ip: '127.0.0.1',
			signedCookies: null,
			user: {},
			cookies: {},
			files: {},
		};

		expect(adaptRequest(req)).toMatchObject(req);
	});
});
