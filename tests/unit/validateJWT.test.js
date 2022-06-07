const {createJWT, isTokenValid} = require('../../app/lib/utils');


describe('VerifyJWT', () => {
	it('should return true if token is valid', () => {
		const token = createJWT({user: 'testUser'});
		expect(isTokenValid(token)).toBeTruthy();
	});

	it('should throw error when provided token is invalid', () => {
		const token = 'fake token';
		expect(() => isTokenValid(token)).toThrow('jwt malformed');
	});
});
