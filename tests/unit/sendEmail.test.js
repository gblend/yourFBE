const emailHelpers = require('../../lib/utils/email/sendEmail');
const {generateToken} = require('../../lib/utils');

describe('SendEmail', () => {
	it('should send verification email to the user', () => {
		const verificationEmail = jest.spyOn(emailHelpers, 'sendVerificationEmail');
		const mockVerificationEmail = ({name, email, verificationToken: token}) => jest.fn().
		mockReturnValue(emailHelpers.sendVerificationEmail({name, email, verificationToken: token}));
		const name = 'Test User';
		const email = 'test@example.com';
		const token = generateToken();
		mockVerificationEmail({name, email, verificationToken: token});

		expect(verificationEmail).toHaveBeenCalledTimes(1);
		expect(verificationEmail).toHaveBeenCalledWith({name, email, verificationToken: token});
	});

	it('should send reset password email to the user', () => {
		const resetPasswordEmail = jest.spyOn(emailHelpers, 'sendResetPasswordEmail');
		const mockResetPasswordEmail = ({name, email, passwordToken: token}) => jest.fn().
		mockReturnValue(emailHelpers.sendResetPasswordEmail({name, email, passwordToken: token}));

		const name = 'Reset User';
		const email = 'reset@example.com';
		const token = generateToken();
		mockResetPasswordEmail({name, email, passwordToken: token});

		expect(resetPasswordEmail).toHaveBeenCalledTimes(1);
		expect(resetPasswordEmail).toHaveBeenCalledWith({name, email, passwordToken: token});
	})
});

