import {createJWT, isTokenValid} from '../../app/lib/utils';

describe('VerifyJWT', () => {
	it('should return true if token is valid', () => {
		const token = createJWT({name: 'testUser', role: 'user'});
		expect(isTokenValid(token)).toBeTruthy();
	});

	it('should throw error when provided token is invalid', () => {
		const token = 'fake token';
		expect(() => isTokenValid(token)).toThrow('user malformed');
	});
});
