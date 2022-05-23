'use strict';

const express = require('express');
require('express-async-errors')
const morgan = require('morgan');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const connectDB = require('./config/db/connect')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')
const cors = require('cors');
const { decodeCookies, logger } = require('./lib/utils');
const path = require("path");
require('dotenv').config();
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const app = express();
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.set('trust proxy', 1);
app.use(
    rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(decodeCookies);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({useTempFiles: true}));

if(app.get('env') === 'development') {
    app.use(morgan('dev'));
}

app.get('/api/v1/', (_req, res) => {
    return res.json({'status': '200', message: 'YourFeeds backend service is running.'});
});
app.get('/api/v1/doc', (_req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.APP_PORT || 5000;
const start = async () => {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
        logger.info(`server listening on port ${port}`);
    });
}

start().then(_ => _);

module.exports = app;
