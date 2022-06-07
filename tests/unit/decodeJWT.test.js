const {createJWT, decodeCookies} = require('../../app/lib/utils');

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

	it('should null for user when provided token is invalid', async () => {
		const token = 'fake token';
		const req = mockRequest({signedCookies: {token}, cookies: {token}});
		const res = mockResponse();
		const next = mockNext(req);

		const decoded = await decodeCookies(req, res, next);
		expect(decoded).toMatchObject({signedCookies: {}, cookies: {}, user: null});
	});
});
