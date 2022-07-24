'use strict';

const morgan = require('morgan');
const cors = require('cors');
const path = require("path");
const xss = require('xss-clean');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const {decodeCookies, logger, appStatus, StatusCodes, appRoutes} = require('./app/lib/utils');
const errorHandlerMiddleware = require('./app/middleware/error_handler');
const feedCategoryRouter = require('./app/routes/feed_category_routes');
const followedFeedRouter = require('./app/routes/followed_feed_routes');
const savedForLaterRouter = require('./app/routes/saved_for_later_routes');
const notFoundMiddleware = require('./app/middleware/not_found');
const resInterceptor = require('./app/middleware/res_interceptor');
const authRouter = require('./app/routes/auth_routes');
const userRouter = require('./app/routes/user_routes');
const feedRouter = require('./app/routes/feed_routes');
const statRouter = require('./app/routes/stat_routes');
const logRouter = require('./app/routes/log_routes');
const configRouter = require('./app/routes/config_routes');
const {config} = require('./app/config/config');
const connectDB = require('./app/config/db/connect');
const express = require('express');
const app = express();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: config.cloudinary.cloudName,
	api_key: config.cloudinary.cloudApiKey,
	api_secret: config.cloudinary.cloudApiSecret
});

const apiRateLimiter = rateLimit({
	windowMs: config.rateLimiter.windowMs,
	max: config.rateLimiter.max,
	standardHeaders: true,
});

module.exports = {
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
	config,
	express,
	app,
	appStatus,
	StatusCodes,
	resInterceptor,
	appRoutes,
}
