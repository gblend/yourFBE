'use strict';

const {User, validateUpdateUser, validateUpdatePassword} = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const NotFoundError = require('../lib/errors/not-found');
const mongoose = require('mongoose');
const {BadRequestError, UnauthenticatedError, UnauthorizedError} = require('../lib/errors');
const {
    checkPermissions,
    adaptRequest,
    constants,
    formatValidationError,
    logger,
    redisGetBatchRecords,
    redisSetBatchRecords, paginate,
} = require('../lib/utils');
const {config} = require('../config/config');
const {saveActivityLog} = require('../lib/dbActivityLog');

const getAllUsers = async (req, res) => {
    const {method, path: _path, queryParams: {sort, pageSize, pageNumber}} = adaptRequest(req);
    let users = await redisGetBatchRecords(config.cache.allUsersCacheKey);
    if (users.length < 1) {
        users = await User.find({role: 'user', status: 'enabled'}).select(['-password', '-verificationToken']);
        if (users.length < 1) {
            logger.info(`${StatusCodes.NOT_FOUND} - No user found for get_all_users - ${method} ${_path}`);
            throw new NotFoundError('No user found.');
        }
        await redisSetBatchRecords(config.cache.allUsersCacheKey, users);
    }

    if (sort) {
        const sortFields = sort.split(',').join(' ');
        users.sort(sortFields);
    }

    let {pagination, result} = paginate(users, {pageSize, pageNumber});
    // const totalLogs = await logsQuery.estimatedDocumentCount().exec();
    logger.info(JSON.stringify(users));
    return res.status(StatusCodes.OK).json({message: 'Users fetched successfully', data: {users: result, pagination}});
}

const getDisabledAccounts = async (req, res) => {
    const {method, path: _path} = adaptRequest(req);
    const users = await User.find({role: 'user', status: 'disabled'}).select(['-password', '-verificationToken']);
    if (!users.length) {
        logger.info(`${StatusCodes.NOT_FOUND} - No user found for get_disabled_accounts - ${method} ${_path}`);
        throw new NotFoundError('No user found');
    }
    logger.info(JSON.stringify(users));
    return res.status(StatusCodes.OK).json({message: 'Disabled accounts fetched successfully', data: {users}});
}

module.exports = {
    getAllUsers,
    getDisabledAccounts,
}
