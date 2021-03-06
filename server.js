'use strict';

require('express-async-errors');
const {
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
	app,
	express,
	appStatus,
	resInterceptor,
	appRoutes,
} = require('./startup');

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
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(fileUpload({useTempFiles: true}));
(config.app.env === 'development') ? app.use(morgan('dev')) : '';

app.get('/api/v1/status', (_req, res) => {
	return res.json({
		'status': 'success',
		message: `${config.app.name} backend service is running.`,
		data: {
			info: appStatus.compile(),
			routes: appRoutes(app),
		},
	});
});
app.get('/api/v1/doc', (_req, res) => {
	return res.sendFile(path.join(__dirname, 'app/public/index.html'));
});

app.use(resInterceptor);
app.use('/api/v1/logs', logRouter);
app.use('/api/v1/stats', statRouter);
app.use('/api/v1/feeds', feedRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1/feed-category', feedCategoryRouter);
app.use('/api/v1/followed-feeds', followedFeedRouter);
app.use('/api/v1/saved-for-later', savedForLaterRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

process.on('uncaughtException', (err) => {
	logger.error(`Uncaught Exception - ${err.stack}`);
	process.exit(1);
});

process.on('unhandledRejection', err => {
	logger.warn(`Unhandled Rejection - ${err.message}`);
});

let conn, server = null;
const start = async () => {
	conn = await connectDB(config.database.uri);
	server = app.listen(config.app.port, () => {
		logger.info(`${config.app.name} server running: ${config.app.baseUrlDev}:${config.app.port}`);
	});
	return {conn, server};
}

start().then(data => {
	conn = data.conn;
	server = data.server;
});

process.on('SIGTERM', () => {
	logger.error('SIGTERM signal received - closing http server.');
	server.close(() => {
		logger.info(`${config.app.name} Http server closed.`);
		conn.connection.close(false, () => {
			process.exit(0);
		});
	});
});

module.exports = app;
