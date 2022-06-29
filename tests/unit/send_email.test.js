const emailHelpers = require('../../app/lib/utils/email/sendEmail');
const {generateToken} = require('../../app/lib/utils');

describe('SendEmail', () => {

	it('should send verification email to the user', async () => {
		const verificationEmail = jest.spyOn(emailHelpers, 'sendVerificationEmail');
		const mockVerificationEmail = async ({name, email, verificationToken: token}) =>
			jest.fn().mockReturnValue(
				await emailHelpers.sendVerificationEmail({name, email, verificationToken: token})
			);

		const name = 'Test User';
		const email = 'test@example.com';
		const token = generateToken();
		emailHelpers.sendVerificationEmail.mockImplementation(() => 'Verification email sent successfully.');
		await mockVerificationEmail({name, email, verificationToken: token}).catch(_ => _);

		expect(verificationEmail).toHaveBeenCalledTimes(1);
		expect(verificationEmail).toHaveBeenCalledWith({name, email, verificationToken: token});
	});

	it('should send reset password email to the user', async () => {
		const resetPasswordEmail = jest.spyOn(emailHelpers, 'sendResetPasswordEmail');
		const mockResetPasswordEmail = async ({name, email, passwordToken: token}) =>
			jest.fn().mockReturnValue(
				await emailHelpers.sendResetPasswordEmail({name, email, passwordToken: token})
			);

		const name = 'Reset User';
		const email = 'reset@example.com';
		const token = generateToken();
		emailHelpers.sendResetPasswordEmail.mockImplementation(() => 'Reset password email sent successfully.');
		await mockResetPasswordEmail({name, email, passwordToken: token}).catch(_ => _);

		expect(resetPasswordEmail).toHaveBeenCalledTimes(1);
		expect(resetPasswordEmail).toHaveBeenCalledWith({name, email, passwordToken: token});
	})
});

