const {sendEmail} = require('./nodemailerConfig');
const {logger} = require('../logger');
require('dotenv').config();

let origin = process.env.BASE_URL_DEV;
if(process.env.NODE_ENV === 'production') {
    origin = process.env.BASE_URL_PROD;
}
const sendResetPasswordEmail = async ({name, email, passwordToken}) => {
    const resetUrl = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
    const message = `
    <p>Hello&nbsp;<strong>${name}</strong></p>
    <p>Kindly use this link to reset your password <a href="${resetUrl}">Reset Password</a></p>
    <p>You can as well copy this url to your browser to reset your password: ${resetUrl}</p>
    `;

    try {
        await sendEmail({to:email, subject:'Password Reset', html:message});
        logger.info('Password reset email sent successfully.');
    } catch (err) {
        logger.error(`${err.statusCode} - Password reset email failed:  ${err.message} - ${err.originalUrl} - ${err.method}`);
    }
}

const sendVerificationEmail = async ({name, email, verificationToken}) => {
    const verifyUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
    const message = `
    <p>Hello&nbsp;<strong>${name}</strong></p>
    <p>Please confirm your email by clicking on the link <a href="${verifyUrl}">Verify Email</a></p>
    <p>You can as well copy this url to your browser to verify your email: ${verifyUrl}</p>
    `;

    try {
        await sendEmail({to:email, subject:'Email Verification', html:message});
        logger.info('Verification email sent successfully.')
    } catch (err) {
       logger.error(`${err.statusCode} - Verification email failed:  ${err.message} - ${err.originalUrl} - ${err.method}`);
    }
}

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail
}
