const {createJWT} = require('../../app/lib/utils');


describe('CreateJWT', () => {
	it('should return created JWT string token when payload is provided', () => {
		expect(typeof (createJWT({}))).toBe('string');
		expect(createJWT({}).length).toBeGreaterThan(0);
	});

	it('should throw an error when payload is undefined', () => {
		expect(() => createJWT(undefined)).toThrow('payload is required');
	});

	it('should throw an error when payload is null (not a plain object)', () => {
		expect(() => createJWT(null)).toThrow();
	});

});
