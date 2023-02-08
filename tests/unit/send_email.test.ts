import emailHelpers from '../../app/lib/utils/email/sendEmail';
import {generateToken} from '../../app/lib/utils';

describe('SendEmail', () => {

	interface ITestEmailPayload {
		name: string,
		email: string,
		verificationToken?: string,
		passwordToken?: string
	}

	it('should send verification email to the user', async () => {
		const verificationEmail = jest.spyOn(emailHelpers, 'sendVerificationEmail');
		const mockVerificationEmail = async ({name, email, verificationToken: token}: ITestEmailPayload) =>
			jest.fn().mockReturnValue(
				await emailHelpers.sendVerificationEmail({name, email, verificationToken: token})
			);

		const _name = 'Test User';
		const _email = 'test@example.com';
		const _token = generateToken();
		emailHelpers.sendVerificationEmail.mockImplementation(() => 'Verification email sent successfully.');
		await mockVerificationEmail({name: _name, email: _email, verificationToken: _token}).catch(_ => _);

		expect(verificationEmail).toHaveBeenCalledTimes(1);
		expect(verificationEmail).toHaveBeenCalledWith({name: _name, email: _email, verificationToken: _token});
	});

	it('should send reset password email to the user', async () => {
		const resetPasswordEmail = jest.spyOn(emailHelpers, 'sendResetPasswordEmail');
		const mockResetPasswordEmail = async ({name, email, passwordToken: token}: ITestEmailPayload) =>
			jest.fn().mockReturnValue(
				await emailHelpers.sendResetPasswordEmail({name, email, passwordToken: token})
			);

		const _name = 'Reset User';
		const _email = 'reset@example.com';
		const _token = generateToken();
		emailHelpers.sendResetPasswordEmail.mockImplementation(() => 'Reset password email sent successfully.');
		await mockResetPasswordEmail({name: _name, email: _email, passwordToken: _token}).catch(_ => _);

		expect(resetPasswordEmail).toHaveBeenCalledTimes(1);
		expect(resetPasswordEmail).toHaveBeenCalledWith({name: _name, email: _email, passwordToken: _token});
	})
});

