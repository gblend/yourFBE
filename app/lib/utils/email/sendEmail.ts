import {sendEmail} from './nodemailer_config';
import {logger} from '../logger';
import {config} from '../../../config/config';
import {config as dotenvConfig} from 'dotenv';
dotenvConfig();

let origin = config.app.baseUrlDev;
if (config.app.env === 'production') {
    origin = config.app.baseUrlProd;
}
type emailDto = {name: string, email: string, passwordToken?: string, verificationToken?: string}

const sendResetPasswordEmail = async ({name, email, passwordToken}: emailDto) => {
    const resetUrl = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
    const message = `
    <p>Hello&nbsp;<strong>${name}</strong></p>
    <p>Kindly use this link to reset your password <a href="${resetUrl}">Reset Password</a></p>
    <p>You can as well copy this url to your browser to reset your password: ${resetUrl}</p>
    `;

    try {
        await sendEmail({to: email, subject: 'Password Reset', html: message});
        logger.info('Password reset email sent successfully.');
    } catch (err: any) {
        logger.error(`Password reset email failed:  ${err.message}`);
    }
}

const sendVerificationEmail = async ({name, email, verificationToken}: emailDto) => {
    const verifyUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
    const message = `
    <p>Hello&nbsp;<strong>${name}</strong></p>
    <p>Please confirm your email by clicking on the link <a href="${verifyUrl}">Verify Email</a></p>
    <p>You can as well copy this url to your browser to verify your email: ${verifyUrl}</p>
    `;

    try {
        await sendEmail({to: email, subject: 'Email Verification', html: message});
        logger.info('Verification email sent successfully.')
    } catch (err: any) {
        logger.error(`Verification email failed:  ${err.message}`);
    }
}

export default {
    sendVerificationEmail,
    sendResetPasswordEmail
}
