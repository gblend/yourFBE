const {Server} = require('socket.io');
const {config} = require('./config/config');
const {logger} = require('./lib/utils');
const {socketErrorText} = require('./lib/utils/socketio_errors');
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


module.exports = {
	httpServer,
	io,
	express,
	app,
}
