'use strict';

const {generateToken} = require('../../app/lib/utils');


describe('GenerateToken', () => {
	const defaultExpectedLength = 80;

	it('without length - should generate token of 80 characters length', () => {
		const result = generateToken();

		expect(result.length).toEqual(defaultExpectedLength);
		expect(typeof (result)).toBe('string');
	});

	it('with length of 20 - should generate token of 40 characters length', () => {
		const result = generateToken(20);

		expect(result.length).toEqual(40);
		expect(typeof (result)).toBe('string');
	});

	it('with length as null - should generate token of 80 characters length', () => {
		const result = generateToken(null);

		expect(result.length).toEqual(defaultExpectedLength);
		expect(typeof (result)).toBe('string');
	});

	it('with length less than 1 - should generate token of 80 characters length', () => {
		const result = generateToken(-0);

		expect(result.length).toEqual(defaultExpectedLength);
		expect(typeof (result)).toBe('string');
	});

	it('with length as empty string - should generate token of 80 characters length', () => {
		const result = generateToken('');

		expect(result.length).toEqual(defaultExpectedLength);
		expect(typeof (result)).toBe('string');
	});
});
