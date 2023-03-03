import mailer from '../../utils/email/sendEmail';
import {config} from '../../../config/config';
import {initConsumer} from '../../utils/amqplib';
const sendVerificationEmail: (...args: any) => void = mailer.sendVerificationEmail;
const sendResetPasswordEmail: (...args: any) => void = mailer.sendResetPasswordEmail;

const execEmailQueueWorker = async () => {
    await initConsumer(sendVerificationEmail, config.amqp.verifyEmailQueue);
    await initConsumer(sendResetPasswordEmail, config.amqp.resetEmailQueue);
}

export {
    execEmailQueueWorker
}
