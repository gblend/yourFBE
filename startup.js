const morgan = require('morgan');
const cors = require('cors');
const path = require("path");
const xss = require('xss-clean');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { decodeCookies, logger } = require('./lib/utils');
const errorHandlerMiddleware = require('./middleware/error-handler');
const feedCategoryRouter = require('./routes/feedCategoryRoutes');
const followedFeedRouter = require('./routes/followedFeedRoutes');
const savedForLaterRouter = require('./routes/savedForLaterRoutes');
const notFoundMiddleware = require('./middleware/not-found');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const feedRouter = require('./routes/feedRoutes');
const logRouter = require('./routes/logRoutes');
const configRouter = require('./routes/config');
const {config} = require('./config/config');
const connectDB = require('./config/db/connect')
const express = require('express');
const app = express();

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


module.exports = {
    morgan,
    errorHandlerMiddleware,
    notFoundMiddleware,
    cookieParser,
    connectDB,
    authRouter,
    mongoSanitize,
    rateLimit,
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
    config,
    express,
    app,
}