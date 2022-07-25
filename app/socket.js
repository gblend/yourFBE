const {Server} = require('socket.io');
const {config} = require('./config/config');
const {logger} = require('./lib/utils');
const {socketErrorText} = require('./lib/utils/socketio_errors');
const {BadRequestError} = require('./lib/errors');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);

const appEnv = config.app.env;
const localUrl = (appEnv === 'production') ? config.auth.socketIo.localUrl : config.auth.socketIo.prodUrl;

const io = new Server (httpServer, {
	cors: {
		origin: [localUrl],
		methods: ['GET', 'POST'],
		credentials: true,
		cookie: {
			name: 'io-cookie',
			secure: appEnv === 'production',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: new Date(Date.now() + config.days.one)
		}
	}
});

io.on('connection', (client) => {
	logger.info(`New client: ${client.id} connected.`);
	client.emit('connected', {status: true, message: 'You are now connected.'});

	client.join('feeds');
	client.join('categories');

	client.on('disconnect', () => {
		logger.info(`Client: ${client.id} disconnected.`);
	});
});

io.on('connection_error', (error) => {
	logger.error(`Connection error: ${socketErrorText(error.code)} - ${error.message}`);
});

const userNamespaceIo = io.of('/auth_user');
// middleware
userNamespaceIo.use(async (client, next) => {
	const token = client.handshake.auth.token;
	if (!token) {
		return next(new BadRequestError('Invalid token. Please pass a valid token.'));
	}
	// decode the token and inject user to socket connection
	const user = await jwt.decode(token);
	if (user === null) {
		return next(new BadRequestError('Invalid token provided. Please pass a valid token.'));
	}
	client.user = user;

	next();
});

userNamespaceIo.on('connection', (authClient) => {
	logger.info(`Authenticated client: ${authClient.user.id} connected.`);

	authClient.join('feeds');
	authClient.join('categories');
	authClient.join('users');

	authClient.on('disconnect', (client) => {
		logger.info(`Authenticated client ${client.id} disconnected.`);
	});
});


module.exports = {
	httpServer,
	io,
	express,
	app,
	userNamespaceIo
}
