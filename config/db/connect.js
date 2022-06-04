const mongoose = require('mongoose');
const {logger} = require('../../lib/utils');
const {StatusCodes} = require('http-status-codes');
const {CustomAPIError} = require('../../lib/errors');

const connectDB = async (url) => {
    try {
        return await mongoose.connect(url)
            .then(connection => {
                logger.info('Database connection established.');
                return connection;
            }).catch(err => {
                throw new CustomAPIError(`Database connection error: ${err.message}`);
            });
    } catch (err) {
        logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR} - ${err.message}`);
    }
};

module.exports = connectDB;
