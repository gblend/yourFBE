import {createJWT, decodeCookies} from '../../app/lib/utils';

describe('DecodeJWT', () => {
	const mockResponse = (): any => {
		return {};
	};

	const mockRequest = (data: any) => {
		return data
	};

	const mockNext = (request: any) => {
		return () => request;
	};

	it('should return user object if token is decoded', async () => {
		const token = createJWT({name: 'testUser', role: 'user'});

		const req = mockRequest({signedCookies: {token}, cookies: {token}});
		const res = mockResponse();
		const next = mockNext(req);

		const result = await decodeCookies(req, res, next);
		expect(result).toMatchObject({signedCookies: {}, cookies: {}, user: {name: 'testUser', role: 'user'}});
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
