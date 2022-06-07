'use strict';

require('dotenv').config();

const config = {
    app: {
        port: process.env.APP_PORT || 5000,
        name: process.env.APP_NAME || 'yourFeeds',
        baseUrlDev: process.env.BASE_URL_DEV,
        baseUrlProd: process.env.BASE_URL_PROD,
        env: process.env.NODE_ENV,
    },
    rateLimiter: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS,
        max: process.env.RATE_LIMIT_MAX,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'yourFeeds',
        expiration: process.env.JWT_EXPIRATION,
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME,
        cloudApiKey: process.env.CLOUD_API_KEY,
        cloudApiSecret: process.env.CLOUD_API_SECRET,
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        authUser: process.env.MAIL_AUTH_USER,
        authPassword: process.env.MAIL_AUTH_PASSWORD,
        from: process.env.MAIL_FROM,
    },
    amqp: {
        host: process.env.AMQP_SERVER_HOST,
        port: process.env.AMQP_SERVER_PORT,
        verifyEmailQueue: process.env.VERIFY_EMAIL_QUEUE_NAME,
        resetEmailQueue: process.env.RESET_EMAIL_QUEUE_NAME,
        defaultUser: process.env.RABBITMQ_DEFAULT_USER,
        defaultPass: process.env.RABBITMQ_DEFAULT_PASS,
    },
    redis: {
        allOrdersKey: process.env.GET_ALL_ORDERS_CACHE_KEY,
        allProductsKey: process.env.GET_ALL_PRODUCTS_CACHE_KEY,
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        db: process.env.REDIS_DB || 0,
        family: process.env.REDIS_FAMILY || 4,
    },
    database: {
        uri: process.env.MONGO_URI,
    },
    days: {
        one: 60 * 60 * 24 * 1000,
        thirty: 60 * 60 * 24 * 1000 * 30,
    },
    imageUpload: {
        maxSize: 2 * 1024 * 1024,
    }
}

module.exports = {config}
