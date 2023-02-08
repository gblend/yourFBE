import {config as dotenvConfig} from 'dotenv';
dotenvConfig();
type numberUnknown =  number | unknown;

const config = {
    app: {
        port: process.env.PORT || process.env.APP_PORT as numberUnknown,
        name: process.env.APP_NAME || 'yourFeeds',
        baseUrlDev: process.env.BASE_URL_DEV as string,
        frontendBaseUrlDev: process.env.FRONTEND_BASE_URL_DEV as string,
        baseUrlProd: process.env.BASE_URL_PROD as string,
        frontendBaseUrlProd: process.env.FRONTEND_BASE_URL_PROD as string,
        env: process.env.NODE_ENV as string,
        prodEnv: process.env.NODE_ENV === 'production',
        baseUrl: (process.env.NODE_ENV === 'production') ? process.env.BASE_URL_PROD : process.env.BASE_URL_DEV as string,
        secret: process.env.APP_SECRET || 'yourFeeds:_xx_default_xx' as string
    },
    rateLimiter: {
        windowMs: process.env.RATE_LIMIT_WINDOW_MS as numberUnknown,
        max: process.env.RATE_LIMIT_MAX as unknown as number,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'yourFeeds:_xx_default_xx' as string,
        expiration: process.env.JWT_EXPIRATION as string,
    },
    session: {
        secret: process.env.APP_SECRET || 'yourFeeds:_xx_default_xx' as string,
    },
    cloudinary: {
        cloudName: process.env.CLOUD_NAME as string,
        cloudApiKey: process.env.CLOUD_API_KEY as string,
        cloudApiSecret: process.env.CLOUD_API_SECRET as string,
    },
    mail: {
        host: process.env.MAIL_HOST as string,
        port: process.env.MAIL_PORT as numberUnknown,
        smtpSecure: process.env.NODE_ENV === 'production',
        authUser: process.env.MAIL_AUTH_USER as string,
        authPassword: process.env.MAIL_AUTH_PASSWORD as string,
        from: process.env.MAIL_FROM as string,
    },
    mailTest: {
        host: process.env.TEST_MAIL_HOST as string,
        port: process.env.TEST_MAIL_PORT as numberUnknown,
        smtpSecure: process.env.NODE_ENV === 'production',
        authUser: process.env.TEST_MAIL_AUTH_USER as string,
        authPassword: process.env.TEST_MAIL_AUTH_PASSWORD as string,
        from: process.env.TEST_MAIL_FROM as string,
    },
    amqp: {
        host: process.env.AMQP_SERVER_HOST as string,
        port: process.env.AMQP_SERVER_PORT as numberUnknown,
        verifyEmailQueue: process.env.VERIFY_EMAIL_QUEUE_NAME as string,
        resetEmailQueue: process.env.RESET_EMAIL_QUEUE_NAME as string,
        defaultUser: process.env.RABBITMQ_DEFAULT_USER as string,
        defaultPass: process.env.RABBITMQ_DEFAULT_PASS as string,
    },
    redis: {
        allOrdersKey: process.env.GET_ALL_ORDERS_CACHE_KEY as string,
        allProductsKey: process.env.GET_ALL_PRODUCTS_CACHE_KEY as string,
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379 as number,
        db: process.env.REDIS_DB || 0 as number,
        family: process.env.REDIS_FAMILY || 4 as number,
    },
    cache: {
      allUsersCacheKey: process.env.ALL_USERS_REDIS_CACHE_KEY as string,
      allAdminCacheKey: process.env.ALL_ADMINS_REDIS_CACHE_KEY as string,
      savePostForLaterCacheKey: process.env.SAVED_FOR_LATER_CACHE_KEY as string,
      rssFeedCacheKey: process.env.RSS_FEED_CACHE_KEY as string,
      notificationsSentCacheKey: process.env.NOTIFICATIONS_SENT_CACHE_KEY as string
    },
    database: {
        uri: process.env.MONGO_URI as string,
    },
    days: {
        one: 60 * 60 * 24 * 1000,
        thirty: 60 * 60 * 24 * 1000 * 30,
    },
    minutes: {
        ten: 1000 * 10 * 60,
    },
    imageUpload: {
        maxSize: 2 * 1024 * 1024,
    },
   auth: {
       socketIoUI: {
           username: process.env.SOCKET_IO_ADMIN_UI_USERNAME as string,
           password: process.env.SOCKET_IO_ADMIN_UI_PASSWORD as string,
           type: process.env.SOCKET_IO_ADMIN_UI_TYPE as string,
           adminUrl: process.env.SOCKET_IO_ADMIN_UI_URL as string,
       },
       socketIo: {
           prodUrl: process.env.SOCKET_IO_URL_PROD as string,
           localUrl: process.env.SOCKET_IO_URL_LOCAL as string
       },
       google: {
           clientID: process.env.SOCIAL_OAUTH_GOOGLE_CLIENT_ID as string,
           clientSecret: process.env.SOCIAL_OAUTH_GOOGLE_CLIENT_SECRET as string,
           callbackURL: process.env.SOCIAL_OAUTH_GOOGLE_CALLBACK_URL as string
       },
       facebook: {
           clientID: process.env.SOCIAL_OAUTH_FACEBOOK_CLIENT_ID as string,
           clientSecret: process.env.SOCIAL_OAUTH_FACEBOOK_CLIENT_SECRET as string,
           callbackURL: process.env.SOCIAL_OAUTH_FACEBOOK_CALLBACK_URL as string,
       },
       twitter: {
           consumerKey: process.env.SOCIAL_OAUTH_TWITTER_CLIENT_KEY as string,
           consumerSecret: process.env.SOCIAL_OAUTH_TWITTER_CLIENT_SECRET as string,
           callbackURL: process.env.SOCIAL_OAUTH_TWITTER_CALLBACK_URL as string
       }
   },
    socket: {
        group: {
            feeds: process.env.SOCKET_GROUP_FEEDS as string,
            categories: process.env.SOCKET_GROUP_CATEGORIES as string,
            users: process.env.SOCKET_GROUP_USERS as string,
            notifications: process.env.SOCKET_GROUP_NOTIFICATIONS as string
        },
        nameSpace: {
            authUser: process.env.SOCKET_NAMESPACE_AUTH_USER as string,
        },
        events: {
            feedCategory: {
                updated: process.env.FEED_CATEGORY_UPDATED as string,
                deleted: process.env.FEED_CATEGORY_DELETED as string,
                created: process.env.FEED_CATEGORY_CREATED as string,
                disabled: process.env.FEED_CATEGORY_DISABLED as string
            },
            feed: {
                updated: process.env.FEED_UPDATED as string,
                deleted: process.env.FEED_DELETED as string,
                created: process.env.FEED_CREATED as string,
                disabled: process.env.FEED_DISABLED as string
            },
            admin: {
                userRegistered: process.env.AUTH_USER_REGISTERED as string
            },
            user: {
                login: process.env.AUTH_USER_LOGIN as string
            },
            notification: {
                updated: process.env.NOTIFICATION_UPDATED as string,
                deleted: process.env.NOTIFICATION_DELETED as string,
                generated: process.env.NOTIFICATION_GENERATED as string
            }
        }
    }
}

export {
    config
}
