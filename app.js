'use strict';

require('express-async-errors')
require('dotenv').config();

const {
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
    config,
    app,
    express
} = require('./startup');

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.set('trust proxy', 1);
app.use(
    rateLimit({
    windowMs: config.rateLimiter.windowMs,
    max: config.rateLimiter.max
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(config.jwt.secret));
app.use(decodeCookies);
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({useTempFiles: true}));

if(config.app.env === 'development') {
    app.use(morgan('dev'));
}

app.get('/api/v1/', (_req, res) => {
    return res.json({'status': '200', message: 'YourFeeds backend service is running.'});
});
app.get('/api/v1/doc', (_req, res) => {
    return res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use('/api/v1/auth', authRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    await connectDB(config.database.uri);
    app.listen(config.app.port, () => {
        logger.info(`server listening on port ${config.app.port}`);
    });
}
start().then(_ => _);

module.exports = app;
