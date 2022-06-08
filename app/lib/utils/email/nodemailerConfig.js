'use strict';

const nodemailer = require('nodemailer');
const {config} = require('../../../config/config');
require('dotenv').config({path: '../.env'});

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
