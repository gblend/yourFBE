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
const {decodeCookies, logger, appStatus, StatusCodes} = require('./app/lib/utils');
const errorHandlerMiddleware = require('./app/middleware/error-handler');
const feedCategoryRouter = require('./app/routes/feedCategoryRoutes');
const followedFeedRouter = require('./app/routes/followedFeedRoutes');
const savedForLaterRouter = require('./app/routes/savedForLaterRoutes');
const notFoundMiddleware = require('./app/middleware/not-found');
const resInterceptor = require('./app/middleware/resInterceptor');
const authRouter = require('./app/routes/authRoutes');
const userRouter = require('./app/routes/userRoutes');
const feedRouter = require('./app/routes/feedRoutes');
const statRouter = require('./app/routes/statRoutes');
const logRouter = require('./app/routes/logRoutes');
const configRouter = require('./app/routes/configRoutes');
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
}
