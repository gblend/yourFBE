const {Server} = require('socket.io');
const {config} = require('./config/config');
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


module.exports = {
	httpServer,
	express,
	app,
}
