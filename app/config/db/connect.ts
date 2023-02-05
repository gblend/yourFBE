import mongoose from 'mongoose';
import {logger} from '../../lib/utils';
import {StatusCodes} from 'http-status-codes';
import {CustomAPIError} from '../../lib/errors';
import {config} from '../config';
import {MongoMemoryServer} from 'mongodb-memory-server';

const appEnv = config.app.env;
const connectionStates = {
    1: 'connected',
    2: 'connecting'
}

export default async (uri: string): Promise<void> => {
    if (appEnv !== 'test') {
        const message = {
            success: 'Database connection established.',
            error: 'Database connection error'
        }
        mongoose.set('strictQuery', true);
        return connect(uri, message);
    }

    return MongoMemoryServer.create().then((mongoDBServer: MongoMemoryServer) => {
        if (!Object.keys(connectionStates).includes(mongoose.connection.readyState.toString())) {
            const msg = {
                success: 'Test database connection established',
                error: 'Test database connection error'
            }
            return connect(mongoDBServer.getUri(), msg);
        }
    });
};

function connect(uri: string, message: {success: string, error: string}): Promise<void> {
    return mongoose.connect(uri)
        .then(() => {
            logger.info(message.success);
        }).catch(err => {
            logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR} - ${err.message}`);
            throw new CustomAPIError(`${message.error}: ${err.message}`);
        });
}
