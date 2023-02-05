'use strict';

const mongoose = require('mongoose');
const {logger} = require('../../lib/utils');
const {StatusCodes} = require('http-status-codes');
const {CustomAPIError} = require('../../lib/errors');
const {config} = require('../config');
const {MongoMemoryServer} = require('mongodb-memory-server');

const appEnv = config.app.env;
const connectionStates = {
    1: 'connected',
    2: 'connecting'
}

module.exports = async (uri) => {
    if (appEnv !== 'test') {
        const message = {
            success: 'Database connection established.',
            error: 'Database connection error'
        }
        return connect(uri, message);
    }

    return MongoMemoryServer.create().then((mongoDBServer) => {
        if (!Object.keys(connectionStates).includes(mongoose.connection.readyState.toString())) {
            const msg = {
                success: 'Test database connection established',
                error: 'Test database connection error'
            }
            return connect(mongoDBServer.getUri(), msg);
        }
    });
};

function connect(uri, message) {
    try {
        return mongoose.connect(uri)
            .then(() => {
                logger.info(message.success);
            }).catch(err => {
                throw new CustomAPIError(`${message.error}: ${err.message}`);
            });
    } catch (err) {
        logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR} - ${err.message}`);
    }
}
