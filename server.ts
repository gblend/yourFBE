import 'express-async-errors';
import {
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
	app,
	express,
	Request,
	Response,
	appStatus,
	resInterceptor,
	appRoutes,
	searchRouter,
	passport,
	handle,
	httpServer,
	session
} from './startup';
const appEnv = config.app.env;

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
if (appEnv === 'development') app.use(morgan('dev'));

app.use(session({
	secret: config.session.secret,
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/v1/status', (_: Request, res: Response) => {
	return res.json({
		'status': 'success',
		message: `${config.app.name} backend service is running.`,
		data: {
			info: appStatus.compile(),
			routes: appRoutes(app),
		},
	});
});
app.get('/api/v1/doc', (_: Request, res: Response) => {
	return res.sendFile(path.join(__dirname, 'app/public/index.html'));
});

app.use(resInterceptor);
app.use('/api/v1/logs', logRouter);
app.use('/api/v1/stats', statRouter);
app.use('/api/v1/feeds', feedRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1/feed-category', feedCategoryRouter);
app.use('/api/v1/followed-feeds', followedFeedRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/saved-for-later', savedForLaterRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

process
	.on('SIGTERM', handle('SIGTERM'))
	.on('unhandledRejection', handle('unhandledRejection'))
	.on('uncaughtException', handle('uncaughtException'));

const start = (): void => {
	connectDB(config.database.uri).then(() => {
		if (appEnv === 'test') return;
		httpServer.listen(config.app.port, () => {
			logger.info(`${config.app.name} server running: ${config.app.baseUrl}:${config.app.port}`);
		});
	});
}

start();

export default app;
