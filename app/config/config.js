'use strict';

require('dotenv').config();

const config = {
    app: {
        port: process.env.APP_PORT || 5000,
        name: process.env.APP_NAME || 'yourFeeds',
        baseUrlDev: process.env.BASE_URL_DEV,
        baseUrlProd: process.env.BASE_URL_PROD,
        env: process.env.NODE_ENV,
        baseUrl: (process.env.NODE_ENV === 'production') ? process.env.BASE_URL_PROD : process.env.BASE_URL_DEV,
        secret: process.env.APP_SECRET || 'yourFeeds:_xx_default_xx'
    },
    rateLimiter: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS,
        max: process.env.RATE_LIMIT_MAX,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'yourFeeds:_xx_default_xx',
        expiration: process.env.JWT_EXPIRATION,
    },
    session: {
        secret: process.env.APP_SECRET || 'yourFeeds:_xx_default_xx',
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
    cache: {
      allUsersCacheKey: process.env.ALL_USERS_REDIS_CACHE_KEY,
      allAdminCacheKey: process.env.ALL_ADMINS_REDIS_CACHE_KEY,
      savePostForLaterCacheKey: process.env.SAVED_FOR_LATER_CACHE_KEY,
      rssFeedCacheKey: process.env.RSS_FEED_CACHE_KEY,
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
    },
   auth: {
       google: {
           clientID: process.env.SOCIAL_OAUTH_GOOGLE_CLIENT_ID,
           clientSecret: process.env.SOCIAL_OAUTH_GOOGLE_CLIENT_SECRET,
           callbackURL: process.env.SOCIAL_OAUTH_GOOGLE_CALLBACK_URL
       },
       facebook: {
           clientID: process.env.SOCIAL_OAUTH_FACEBOOK_CLIENT_ID,
           clientSecret: process.env.SOCIAL_OAUTH_FACEBOOK_CLIENT_SECRET,
           callbackURL: process.env.SOCIAL_OAUTH_FACEBOOK_CALLBACK_URL
       },
       twitter: {
           consumerKey: process.env.SOCIAL_OAUTH_TWITTER_CLIENT_KEY,
           consumerSecret: process.env.SOCIAL_OAUTH_TWITTER_CLIENT_SECRET,
           callbackURL: process.env.SOCIAL_OAUTH_TWITTER_CALLBACK_URL
       }
   }
}

module.exports = {config}
