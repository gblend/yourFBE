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

const getAllAdmins = async (req, res) => {
    const {queryParams: {sort}, path: _path, method} = adaptRequest(req);
    let admins = await redisGetBatchRecords(config.cache.allUsersCacheKey);
    if (admins.length < 1) {
        admins = await User.find({role: 'admin'}).select(['-password', '-verificationToken']);
        if (admins.length < 1) {
            logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - No admin found for get_all_admins - ${method} ${_path}`));
            throw new NotFoundError('No admin found');
        }
        await redisSetBatchRecords(config.cache.allAdminCacheKey, admins);
    }
    if (sort) {
        const sortFields = sort.split(',').join(' ')
        admins.sort(sortFields)
    }
    logger.info(`${StatusCodes.OK} - ${JSON.stringify(admins)} - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({message: 'Admins fetched successfully', data: {admins}});
}

const getSingleUser = async (req, res) => {
    const {pathParams: {id: userId}, user: reqUser, method, path: _path} = adaptRequest(req);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        logger.info(`${StatusCodes.BAD_REQUEST} ${constants.auth.INVALID_CREDENTIALS('user id')} for get_single_user - ${method} ${_path}`);
        throw new BadRequestError(constants.auth.INVALID_CREDENTIALS('user id'));
    }
    const user = await User.findOne({_id: userId, status: 'enabled'}).select(['-password', '-verificationToken']);
    if (!user) {
        logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - User with id ${userId} does not exist for get_single_user - ${method} ${_path}`));
        throw new NotFoundError(`User with id ${userId} does not exist`);
    }
    checkPermissions(reqUser, user._id);
    logger.info(`${StatusCodes.OK} - ${JSON.stringify(JSON.stringify(user))} - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({message: 'User fetched successfully', data: {user}});
}

const showCurrentUser = async (req, res) => {
    const {user, path: _path, method} = adaptRequest(req);
    if (!user) {
        logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access for show_current_user - ${method} ${_path}`);
        throw new UnauthenticatedError(`Unauthorized access`);
    }

    logger.info(`${StatusCodes.UNAUTHORIZED} - ${JSON.stringify(JSON.stringify(user))} - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({message: 'User fetched successfully', data: {user}});
}

const updateUser = async (req, res) => {
    logger.info(JSON.stringify(req.body));
    const {user, body, path: _path, method, pathParams: {id: userId}} = adaptRequest(req);
    const {error} = validateUpdateUser(body);
    if (error) {
        logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {errors: formatValidationError(error)}
        });
    }

    const account = await User.findOneAndUpdate({_id: userId}, body, {new: true, runValidators: true});
    if (!account) {
        logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - User with id ${userId} does not exist for update_account - ${method} ${_path}`));
        throw new NotFoundError(`User does not exist`);
    }
    checkPermissions(user, account._id);
    const token = await account.createJWT();
    account.password = undefined;

    const logData = {
        action: `updateUser - ${method} ${_path} - by ${user.role}`,
        resourceName: 'users',
        user: user.id,
    }
    await saveActivityLog(logData, method, _path);
    logger.info(`${StatusCodes.OK} - ${JSON.stringify(JSON.stringify(user))} - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({
        message: 'Information updated successfully',
        data: {token, user: account, }
    });
}

const disableUserAccount = async (req, res) => {
    const {pathParams: {id: userId}, user, method, path} = adaptRequest(req);
    const account = await User.findById(userId).select(['-password', '-verificationToken']);

    if(user.role !== 'admin' && user.id !== account._id.toHexString()) {
        throw new UnauthorizedError('You are not authorized to perform this action.')
    }
    checkPermissions(user, account._id);

    account.status = 'disabled';
    await account.save();

    const logData = {
        action: `disableUserAccount: ${userId} - ${method} ${path} - by ${user.role}`,
        resourceName: 'users',
        user: user.id,
    }
    await saveActivityLog(logData, method, path);
    return res.status(StatusCodes.OK).json({
        message: (user.role === 'admin') ?`${account.firstname} ${account.lastname}'s account disabled successfully` :
            'Account disabled successfully',
    });
}

module.exports = {
    getAllUsers,
    getAllAdmins,
    getSingleUser,
    showCurrentUser,
    updateUser,
    getDisabledAccounts,
    disableUserAccount
}
