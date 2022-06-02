const {createJWT, decodeCookies} = require('../../lib/utils');

describe('DecodeJWT', () => {
	const mockResponse = () => {
		return {};
	};

	const mockRequest = (data) => {
		return data
	};

	const mockNext = (request) => {
		return () => request;
	};

	it('should return user object if token is decoded', async () => {
		const token = createJWT({user: 'testUser', role: 'user'});

		const req = mockRequest({signedCookies: {token}, cookies: {token}});
		const res = mockResponse();
		const next = mockNext(req);

		const result = await decodeCookies(req, res, next);
		expect(result).toMatchObject({signedCookies: {}, cookies: {}, user: {user: 'testUser', role: 'user'}});
	});

});
