const mongoose = require('mongoose');
const {logger} = require('../../lib/utils');
const {StatusCodes} = require('http-status-codes');

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        logger.info(`Database connection established`);
    } catch (err) {
        logger.error(`${StatusCodes.INTERNAL_SERVER_ERROR} - Database connection failed: ${err.message}`);
    }
};

module.exports = connectDB;
