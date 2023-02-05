import {createTransport} from 'nodemailer';
import {config} from '../../../config/config';
import {config as dotenvConfig} from 'dotenv';
dotenvConfig({path: '../.env'});

const transporterInit = () => {
    return createTransport({
        host: config.mail.host,
        port: Number(config.mail.port),
        secure: config.mail.smtpSecure,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: config.mail.authUser,
            pass: config.mail.authPassword
        }
    })
}

const sendEmail = ({to, subject, html}: {to: string, subject: string, html: any}) => {
    const from = config.mail.from
    return transporterInit().sendMail({
        from,
        to,
        subject,
        html
    })
}

export {
    sendEmail
}
