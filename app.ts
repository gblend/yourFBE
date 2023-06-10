import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import xss from 'xss-clean';
import helmet from 'helmet';
import passport from 'passport';
import cloudinary from 'cloudinary';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
export {initCron} from './app/scheduler';
import {config} from './app/config/config';
export {connectDB} from './app/config/db/connect';
import {app, express, httpServer} from './app/socket';
import {decodeCookies, logger, serverStatus} from './app/lib/utils';
import sentryErrorHandler, {sentryRequestHandler, sentryTracingHandler} from './sentry';
import {errorHandler, routeNotFound, eventHandler, responseInterceptor} from './app/middleware';
import {
	apiDocRouter,
	feedCategoryRouter,
	followedFeedRouter,
	savedForLaterRouter,
	authRouter,
	userRouter,
	searchRouter,
	feedRouter,
	statRouter,
	logRouter,
	postRouter,
	configRouter,
	notificationRouter,
} from './app/routes';
const appEnv = config.app.env;
const prefix = config.app.prefix;

cloudinary.v2.config({
	cloud_name: config.cloudinary.cloudName,
	api_key: config.cloudinary.cloudApiKey,
	api_secret: config.cloudinary.cloudApiSecret
});

const apiRateLimiter = rateLimit({
	windowMs: config.rateLimiter.windowMs,
	max: config.rateLimiter.max,
	standardHeaders: true,
});

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.set('trust proxy', 1);
app.use('/api', apiRateLimiter);
app.use(express.json({limit: '300kb'}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(config.jwt.secret));
app.use(decodeCookies);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({useTempFiles: true}));
if (appEnv === 'development') app.use(morgan('dev'));

app.use(session({
	secret: config.session.secret,
	resave: false,
	saveUninitialized: true
}));
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

export {
	logger,
	config,
	httpServer,
	appEnv,
	app,
}
