import {config} from '../config/config';
const {baseUrlDev, prefix, baseUrlProd} = config.app;

export default {
    openapi: '3.0.0',
    info: {
        title: 'FeedKit API Documentation',
        description: 'Documentation for FeedKit backend APIs',
        version: '1.0.0',
        contact: {
            email: 'gabrielilo190@gmail.com',
            phone: '+2348166195490',
            url: 'https://gblend.tech'
        }
    },
    schemes: ['http','https'],

    servers: [
        {
            url: `${baseUrlDev}${prefix}`,
            description: 'Local Environment',
        },
        {
            url: `${baseUrlProd}/${prefix}`,
            description: 'Production Environment',
        }
    ],
}
