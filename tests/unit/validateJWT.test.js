const {createJWT, isTokenValid} = require('../../lib/utils');


describe('CreateJWT', () => {
	it.only('should return true if token is valid', () => {
		const token = createJWT({user: 'testUser'});
		expect(isTokenValid(token)).toBeTruthy();
	});
	
});
