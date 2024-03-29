import { config as dotenvConfig } from 'dotenv';

dotenvConfig();
type numberUnknown = number | unknown;
const envList: string[] = ['production', 'development'];
const currentEnv: string = process.env.NODE_ENV || '';
const isProdEnv: boolean = currentEnv === 'production';

export const config = {
  app: {
    port: process.env.PORT || (process.env.APP_PORT as numberUnknown),
    name: process.env.APP_NAME || 'yourFeeds',
    baseUrlDev: process.env.BASE_URL_DEV as string,
    frontendBaseUrlDev: process.env.FRONTEND_BASE_URL_DEV as string,
    baseUrlProd: process.env.BASE_URL_PROD as string,
    frontendBaseUrlProd: process.env.FRONTEND_BASE_URL_PROD as string,
    env: currentEnv,
    prodEnv: isProdEnv,
    baseUrl: isProdEnv
      ? process.env.BASE_URL_PROD
      : (process.env.BASE_URL_DEV as string),
    secret: process.env.APP_SECRET || ('yourFeeds:_xx_default_xx' as string),
    prefix: '/api/v1',
    enabledEnv: envList.includes(currentEnv),
  },
  rateLimiter: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS as numberUnknown,
    max: process.env.RATE_LIMIT_MAX as unknown as number,
  },
  jwt: {
    secret: process.env.JWT_SECRET || ('yourFeeds:_xx_default_xx' as string),
    expiration: process.env.JWT_EXPIRATION as string,
  },
  session: {
    secret: process.env.APP_SECRET || ('yourFeeds:_xx_default_xx' as string),
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
    host: process.env.AMQP_SERVER_HOST || 'localhost',
    vhost: process.env.AMQP_SERVER_VHOST || '/',
    port: process.env.AMQP_SERVER_PORT || 5672,
    password: process.env.AMQP_SERVER_PASSWORD || 'guest',
    protocol: process.env.AMQP_SERVER_PROTOCOL || 'amqp',
    username: process.env.AMQP_SERVER_USERNAME || 'guest',
    verifyEmailQueue: process.env.VERIFY_EMAIL_QUEUE_NAME as string,
    resetEmailQueue: process.env.RESET_EMAIL_QUEUE_NAME as string,
    defaultUser: process.env.AMQP_DEFAULT_USERNAME as string,
    defaultPass: process.env.AMQP_DEFAULT_PASSWORD as string,
  },
  redis: {
    allOrdersKey: process.env.GET_ALL_ORDERS_CACHE_KEY as string,
    allProductsKey: process.env.GET_ALL_PRODUCTS_CACHE_KEY as string,
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || (6379 as number),
    password: process.env.REDIS_PASSWORD || ('' as string),
    db: process.env.REDIS_DB || (0 as number),
    family: process.env.REDIS_FAMILY || (4 as number),
  },
  cache: {
    usersKey: process.env.ALL_USERS_CACHE_KEY as string,
    adminsKey: process.env.ALL_ADMINS_CACHE_KEY as string,
    feedCategoriesKey: 'feed_categories',
    feedCategoryKey: 'feed_category',
    savePostForLaterCacheKey: process.env.SAVED_FOR_LATER_CACHE_KEY as string,
    feedPostsKey: process.env.RSS_FEED_POSTS_CACHE_KEY as string,
    notificationsSentKey: process.env.NOTIFICATIONS_SENT_CACHE_KEY as string,
    feedsPollingCronKey: 'feeds_polling_cron',
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
    five: 1000 * 5 * 60,
    fiftyFive: 1000 * 55 * 60,
  },
  hours: {
    one: 1000 * 60 * 60,
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
      localUrl: process.env.SOCKET_IO_URL_LOCAL as string,
    },
    google: {
      clientID: process.env.SOCIAL_OAUTH_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.SOCIAL_OAUTH_GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.SOCIAL_OAUTH_GOOGLE_CALLBACK_URL || '',
    },
    facebook: {
      clientID: process.env.SOCIAL_OAUTH_FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.SOCIAL_OAUTH_FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.SOCIAL_OAUTH_FACEBOOK_CALLBACK_URL || '',
    },
    twitter: {
      consumerKey: process.env.SOCIAL_OAUTH_TWITTER_CLIENT_KEY || '',
      consumerSecret: process.env.SOCIAL_OAUTH_TWITTER_CLIENT_SECRET || '',
      callbackURL: process.env.SOCIAL_OAUTH_TWITTER_CALLBACK_URL || '',
    },
  },
  socket: {
    group: {
      feeds: process.env.SOCKET_GROUP_FEEDS as string,
      categories: process.env.SOCKET_GROUP_CATEGORIES as string,
      users: process.env.SOCKET_GROUP_USERS as string,
      notifications: process.env.SOCKET_GROUP_NOTIFICATIONS as string,
    },
    nameSpace: {
      authUser: process.env.SOCKET_NAMESPACE_AUTH_USER as string,
    },
    events: {
      feedCategory: {
        updated: process.env.FEED_CATEGORY_UPDATED as string,
        deleted: process.env.FEED_CATEGORY_DELETED as string,
        created: process.env.FEED_CATEGORY_CREATED as string,
        disabled: process.env.FEED_CATEGORY_DISABLED as string,
      },
      feed: {
        updated: process.env.FEED_UPDATED as string,
        deleted: process.env.FEED_DELETED as string,
        created: process.env.FEED_CREATED as string,
        disabled: process.env.FEED_DISABLED as string,
      },
      admin: {
        userRegistered: process.env.AUTH_USER_REGISTERED as string,
      },
      user: {
        login: process.env.AUTH_USER_LOGIN as string,
      },
      notification: {
        updated: process.env.NOTIFICATION_UPDATED as string,
        deleted: process.env.NOTIFICATION_DELETED as string,
        generated: process.env.NOTIFICATION_GENERATED as string,
      },
    },
  },
  newrelic: {
    appName: process.env.APP_NAME || 'yourFeeds',
    licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    enabled: process.env.NEW_RELIC_ENABLED,
    compressedContentEncoding:
      process.env.NEW_RELIC_COMPRESSED_CONTENT_ENCODING,
    logEnabled: process.env.NEW_RELIC_LOG_ENABLED,
    errorCollectorEnabled: process.env.NEW_RELIC_ERROR_COLLECTOR_ENABLED,
    tracerEnabled: process.env.NEW_RELIC_TRACER_ENABLED,
    recordSql: process.env.NEW_RELIC_RECORD_SQL,
    transactionEventsEnabled: process.env.NEW_RELIC_TRANSACTION_EVENTS_ENABLED,
    slowSqlEnabled: process.env.NEW_RELIC_SLOW_SQL_ENABLED,
  },
};
