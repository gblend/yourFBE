import {Server, Socket} from 'socket.io';
import {createAdapter} from '@socket.io/redis-adapter';
import {getRedisConnection, redisSet, redisGetBatchRecords, logger} from './lib/utils';
import {config} from './config/config';
import {socketErrorText} from './lib/utils/socketio_errors';
import {BadRequestError} from './lib/errors';
import {IServerOptions} from './interface';
import jwt from 'jsonwebtoken';
import express, {Application} from 'express';
import {createServer} from 'http';
import {prepareMissedNotification} from './controllers/notificationController';

const app: Application = express();

const httpServer = createServer(app);
const socketGroup = config.socket.group;

const appEnv = config.app.env;
const originUrl: string = (appEnv === 'production') ? config.auth.socketIo.prodUrl as string
    : config.auth.socketIo.localUrl as string;

const serverOptions: IServerOptions = {
    cors: {
        origin: [originUrl],
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
}

const io = new Server(httpServer, serverOptions);
const pubClient = getRedisConnection();
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient, {key: 'socket'}));

io.on('connection', (client: Socket | any): void => {
    logger.info(`New client: ${client.id} connected.`);
    client.emit('connected', {status: true, message: 'You are now connected.'});

    client.join([socketGroup.feeds, socketGroup.categories]);

    client.on('close', () => {
        logger.error(`Socket client closed connection: ${client.id}`);
    })
    client.on('error', (error: any) => {
        logger.error(`Socket client error: ${error}`);
    });

    client.on('disconnect', () => {
        logger.info(`Unauthenticated client disconnected: ${client.id}`);
    });
}).on('error', (err) => {
    logger.error(`Socket server error: ${err}`);
});

io.on('connection_error', (error: any): void => {
    logger.error(`Connection error: ${socketErrorText(error.code)} - ${error.message}`);
});

const userNamespaceIo = io.of(`/${config.socket.nameSpace.authUser}`);
// middleware
userNamespaceIo.use(async (client: Socket | any, next: any): Promise<string | void> => {
    const token = client.handshake.auth.token;
    if (!token) {
        return next(new BadRequestError('Invalid token. Please pass a valid token.'));
    }
    // decode the request token and inject user to socket connection
    const user = await jwt.decode(token);
    if (user === null) {
        return next(new BadRequestError('Invalid token provided. Please pass a valid token.'));
    }
    client.user = user;

    next();
});

userNamespaceIo.on('connection', async (authClient: Socket | any): Promise<void> => {
    const userId = authClient.user.id;
    logger.info(`Authenticated client: ${userId} connected.`);

    const notifications: any = await redisGetBatchRecords(config.cache.notificationsSentKey);
    if (notifications.length) {
        notifications.forEach((data: any) => {
            if (data.users.indexOf(userId) === -1) {
                prepareMissedNotification(data.notification, userId).then(notification => {
                    if (notification) authClient.emit(config.socket.events.notification.generated, notification);
                });

                data.users = data.users.concat(`,${userId}`);
                redisSet(data.cacheKey, data);
            }
        })
    }

    authClient.join([socketGroup.feeds, socketGroup.categories,
        socketGroup.users, socketGroup.notifications]);

    authClient.on('disconnect', (): void => {
        logger.info(`Authenticated client: ${userId} disconnected.`);
    });
});

export {
    httpServer,
    io,
    express,
    app,
    pubClient,
    subClient,
    userNamespaceIo
}
