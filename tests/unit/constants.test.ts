const {constants} = require('../../app/lib/utils');

describe('Constants', () => {
	it('should return INVALID_CREDENTIALS', () => {
		expect(constants.auth.INVALID_CREDENTIALS()).toContain('Invalid');
	});

	it('should return ALREADY_IN_USE', () => {
		expect(constants.auth.ALREADY_IN_USE()).toContain('is already in use.');
	});

	it('should return AUTHENTICATION_INVALID', () => {
		expect(constants.auth.AUTHENTICATION_INVALID).toContain('Authentication invalid.');
	});

	it('should return SUCCESSFUL', () => {
		expect(constants.auth.SUCCESSFUL()).toContain('successful.');
	});
});
