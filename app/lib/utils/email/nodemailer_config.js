'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config({path: '../.env'});
const {config} = require('../../../config/config');

const transporterInit = () => {
    return nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        auth: {
            user: config.mail.authUser,
            pass: config.mail.authPassword
        }
    })
}

const sendEmail = ({to, subject, html}) => {
    const from = config.mail.from
    return transporterInit().sendMail({
        from,
        to,
        subject,
        html
    })
}

module.exports = {
    sendEmail
}
