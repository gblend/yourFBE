import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import xss from 'xss-clean';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import {app, express, httpServer} from './app/socket';
import { Request, Response } from './app/types';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import {decodeCookies, logger, appStatus, StatusCodes, appRoutes} from './app/lib/utils';
import {errorHandlerMiddleware} from './app/middleware/error_handler';
import feedCategoryRouter from './app/routes/feed_category';
import followedFeedRouter from './app/routes/followed_feed';
import savedForLaterRouter from './app/routes/saved_for_later';
import notFoundMiddleware from './app/middleware/not_found';
import {handle} from './app/middleware/handle_event';
import resInterceptor from './app/middleware/res_interceptor';
import authRouter from './app/routes/auth';
import userRouter from './app/routes/user';
import searchRouter from './app/routes/search';
import feedRouter from './app/routes/feed';
import statRouter from './app/routes/stat';
import logRouter from './app/routes/log';
import configRouter from './app/routes/config';
import notificationRouter from './app/routes/notification';
import {config} from './app/config/config';
import connectDB from './app/config/db/connect';
import cloudinary from 'cloudinary';

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

export {
	morgan,
	errorHandlerMiddleware,
	notFoundMiddleware,
	cookieParser,
	connectDB,
	authRouter,
	mongoSanitize,
	apiRateLimiter,
	helmet,
	xss,
	path,
	cors,
	decodeCookies,
	logger,
	fileUpload,
	configRouter,
	savedForLaterRouter,
	userRouter,
	feedCategoryRouter,
	feedRouter,
	followedFeedRouter,
	logRouter,
	statRouter,
	notificationRouter,
	config,
	express,
	Request,
	Response,
	app,
	appStatus,
	StatusCodes,
	resInterceptor,
	appRoutes,
	searchRouter,
	httpServer,
	passport,
	handle,
	session
}
