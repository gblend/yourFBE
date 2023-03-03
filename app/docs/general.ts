import {config} from '../config/config';

export default {
    openapi: '3.0.*',
    info: {
        title: 'yourFeeds API Documentation',
        description: 'Documentation for yourFeeds backend APIs',
        version: '1.0.0',
        contact: {
            email: 'gabrielilo190@gmail.com',
            phone: '+2348166195490',
            url: 'https://gblend.tech'
        }
    },

    servers: [
        {
            url: `${config.app.baseUrlDev}:${config.app.port}/api/v1`,
            description: "Local Environment",
        },
        {
            url: `${config.app.baseUrlProd}:${config.app.port}/api/v1`,
            description: "Production Environment",
        }
    ],
}
