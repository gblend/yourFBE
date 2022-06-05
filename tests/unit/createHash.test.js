const {createHash} = require('../../lib/utils');

describe('CreateHash', () => {
	it('should return null when input is null', () => {
		const value = null;
		const hashed = createHash(value);

		expect(hashed).toBe(null);
	});

	it('should return undefined when input is undefined', () => {
		const value = undefined;
		const hashed = createHash(value);

		expect(hashed).toBe(undefined);
	});

	it('should create a new hash with string value', () => {
		const value = 'test';
		const hashed = createHash(value);

		expect(hashed.length).toEqual(64);
		expect(typeof (hashed)).toStrictEqual('string');
	});
})
