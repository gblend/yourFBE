const {createJWT} = require('../../lib/utils');


describe('CreateJWT', () => {
	it.only('should return created JWT string token when payload is provided', () => {
		expect(typeof (createJWT({}))).toBe('string');
		expect(createJWT({}).length).toBeGreaterThan(0);
	});

	it.only('should throw an error when payload is undefined', () => {
		expect(() => createJWT(undefined)).toThrow('payload is required');
	});

	it.only('should throw an error when payload is null (not a plain object)', () => {
		expect(() => createJWT(null)).toThrow();
	});

});
