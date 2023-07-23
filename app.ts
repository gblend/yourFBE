import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import passport from 'passport';
import cloudinary from 'cloudinary';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './app/config/config';
import { app, express, httpServer } from './app/socket';
import {
  constants,
  decodeCookies,
  getRedisConnection,
  logger,
  serverStatus,
  xss,
} from './app/lib/utils';
import sentryErrorHandler, {
  sentryRequestHandler,
  sentryTracingHandler,
} from './sentry';
import {
  errorHandler,
  eventHandler,
  responseInterceptor,
  routeNotFound,
} from './app/middleware';
import {
  apiDocRouter,
  authRouter,
  configRouter,
  feedCategoryRouter,
  feedRouter,
  followedFeedRouter,
  logRouter,
  notificationRouter,
  postRouter,
  savedForLaterRouter,
  searchRouter,
  statRouter,
  userRouter,
} from './app/routes';

export { initCron } from './app/scheduler';
export { connectDB } from './app/config/db/connect';
const { env: appEnv, prefix } = config.app;

cloudinary.v2.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.cloudApiKey,
  api_secret: config.cloudinary.cloudApiSecret,
});

const apiRateLimiter = rateLimit({
  windowMs: config.rateLimiter.windowMs,
  max: config.rateLimiter.max,
  standardHeaders: true,
});

let sessionRedisStore: any = {};
if (constants.envList.includes(appEnv)) {
  import('newrelic').then((newrelicModule) => {
    const newrelic = newrelicModule.default;
    // instrument express after the agent has been loaded
    newrelic.instrumentLoadedModule('express', express);
  });

  import('connect-redis')
    .then((redisStoreModule) => {
      const RedisStore = redisStoreModule.default;
      const redisClient = getRedisConnection();
      sessionRedisStore = {
        store: new RedisStore({
          prefix: config.app.name,
          client: redisClient,
        }),
      };
    })
    .catch((err: Error) => err);
}

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.set('trust proxy', 1);
app.use('/api', apiRateLimiter);
app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.jwt.secret));
app.use(decodeCookies);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({ useTempFiles: true }));
if (appEnv === 'development') app.use(morgan('dev'));

app.use(
  session({
    ...sessionRedisStore,
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(sentryRequestHandler);
app.use(sentryTracingHandler);
app.get(`${prefix}/status`, serverStatus);
app.use(responseInterceptor);
app.use('/', apiDocRouter);
app.use(`${prefix}/logs`, logRouter);
app.use(`${prefix}/posts`, postRouter);
app.use(`${prefix}/stats`, statRouter);
app.use(`${prefix}/feeds`, feedRouter);
app.use(`${prefix}/auth`, authRouter);
app.use(`${prefix}/users`, userRouter);
app.use(`${prefix}/search`, searchRouter);
app.use(`${prefix}/config`, configRouter);
app.use(`${prefix}/feed-category`, feedCategoryRouter);
app.use(`${prefix}/followed-feeds`, followedFeedRouter);
app.use(`${prefix}/notifications`, notificationRouter);
app.use(`${prefix}/saved-for-later`, savedForLaterRouter);
app.use(routeNotFound);
app.use(errorHandler);
app.use(sentryErrorHandler);

process
  .on('SIGTERM', eventHandler('SIGTERM'))
  .on('unhandledRejection', eventHandler('unhandledRejection'))
  .on('uncaughtException', eventHandler('uncaughtException'));

export { logger, config, httpServer, appEnv, app };
