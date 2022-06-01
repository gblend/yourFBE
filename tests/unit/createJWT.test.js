const {createJWT} = require('../../lib/utils');


describe('CreateJWT', () => {
	it.only('should return created JWT string token when payload is provided', () => {
		expect(typeof (createJWT({}))).toBe('string');
		expect(createJWT({}).length).toBeGreaterThan(0);
	});

});
