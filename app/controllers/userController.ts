import {User, validateUpdatePassword, validateUpdateUser} from '../models';
import {StatusCodes} from 'http-status-codes';
import NotFoundError from '../lib/errors/not_found';
import mongoose from 'mongoose';
import {config} from '../config/config';
import {userNamespaceIo} from '../socket';
import {saveActivityLog} from '../lib/dbActivityLog';
import {Request, Response} from '../types';
import {BadRequestError, UnauthenticatedError, UnauthorizedError} from '../lib/errors';
import {
    adaptRequest,
    checkPermissions,
    constants,
    createObjectId,
    formatValidationError,
    logger,
    paginate,
    redisGetBatchRecords,
    redisSetBatchRecords
} from '../lib/utils';
import {IResponse} from '../interface';

const getAllUsers = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {method, path: _path, queryParams: {sort, pageSize, pageNumber}} = adaptRequest(req);
    const usersQuery = User.find({
        role: constants.role.USER,
        status: constants.STATUS_ENABLED
    }).select(['-password', '-verificationToken']);

    if (sort) {
        const sortFields = sort.split(',').join(' ');
        usersQuery.sort(sortFields);
    }

    const {pagination, result} = await paginate(usersQuery, {pageSize, pageNumber});
    const usersData = await result;

    if (!usersData.length) {
        logger.info(`${StatusCodes.NOT_FOUND} - No user found for get_all_users - ${method} ${_path}`);
        throw new NotFoundError('No user found.');
    }

    logger.info(`${JSON.stringify(pagination)} ${JSON.stringify(usersData)}`);
    return res.status(StatusCodes.OK).json({
        message: 'Users fetched successfully',
        data: {users: usersData, pagination}
    });
}

const getDisabledAccounts = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {method, path: _path, queryParams: {pageSize, pageNumber}} = adaptRequest(req);
    const users = await User.find({role: constants.role.USER, status: constants.STATUS_DISABLED})
        .select(['-password', '-verificationToken']);
    if (!users.length) {
        logger.info(`${StatusCodes.NOT_FOUND} - No user found for get_disabled_accounts - ${method} ${_path}`);
        throw new NotFoundError('No disabled account found');
    }

    const {pagination, result} = await paginate(users, {pageSize, pageNumber});
    logger.info(JSON.stringify(result));
    return res.status(StatusCodes.OK).json({
        message: 'Disabled accounts fetched successfully',
        data: {users: result, pagination}
    });
}

const getAllAdmins = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {queryParams: {sort, pageSize, pageNumber}, path: _path, method} = adaptRequest(req);
    let admins = await redisGetBatchRecords(config.cache.adminsKey);

    if (admins.length < 1) {
        admins = await User.find({role: constants.role.ADMIN}).select(['-password', '-verificationToken']);
        if (admins.length < 1) {
            logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - No admin found for get_all_admins - ${method} ${_path}`));
            throw new NotFoundError('No admin found');
        }
        await redisSetBatchRecords(config.cache.adminsKey, admins);
    }
    if (sort) {
        const sortFields = sort.split(',').join(' ')
        admins.sort(sortFields)
    }

    const {pagination, result} = await paginate(admins, {pageSize, pageNumber});
    logger.info(`${StatusCodes.OK} - ${JSON.stringify(admins)} - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({
        message: 'Admins fetched successfully',
        data: {admins: result, pagination}
    });
}

const getUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: userId}, user: reqUser, method, path: _path} = adaptRequest(req);
    if (!mongoose.isValidObjectId(userId)) {
        logger.info(`${StatusCodes.BAD_REQUEST} ${constants.auth.INVALID_CREDENTIALS('user id')} for get_user - ${method} ${_path}`);
        throw new BadRequestError(constants.auth.INVALID_CREDENTIALS('user id'));
    }
    const user = await User.findOne({
        _id: userId,
        status: constants.STATUS_ENABLED
    }).select(['-password', '-verificationToken']);
    if (!user) {
        logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - User with id ${userId} does not exist for get_single_user - ${method} ${_path}`));
        throw new NotFoundError(`User with id ${userId} does not exist`);
    }
    checkPermissions(reqUser, user._id);
    logger.info(`${StatusCodes.OK} - Account details fetched successfully - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({message: 'Account details fetched successfully', data: {user}});
}

const showCurrentUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {user: {id}, path: _path, method} = adaptRequest(req);
    if (!id) {
        logger.info(`${StatusCodes.UNAUTHORIZED} - Unauthorized access for show_current_user - ${method} ${_path}`);
        throw new UnauthenticatedError(`Unauthorized access`);
    }

    const userData = await User.findOne({_id: createObjectId(id), status: constants.STATUS_ENABLED})
        .populate({
            path: 'savedForLater followedFeeds',
            select: ['_id', 'url', 'title', 'description', 'logoUrl', 'category'],
            model: 'Feed'
        })
        .select(['-password', '-verificationToken']);
    if (!userData) {
        logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - User with id ${id} does not exist for show_current_user - ${method} ${_path}`));
        throw new NotFoundError(`User with id ${id} does not exist`);
    }
    return res.status(StatusCodes.OK).json({message: 'Account details fetched successfully', data: {user: userData}});
}

const updateUser = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {user, body, path: _path, method, pathParams} = adaptRequest(req);
    let userId = pathParams.id;
    if (!userId) userId = user.id;
    const {error} = validateUpdateUser(body);

    if (error) {
        logger.error(JSON.stringify(JSON.stringify(formatValidationError(error))));
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {errors: formatValidationError(error)}
        });
    }

    let account: any = await User.findById(userId);
    checkPermissions(user, account._id);

    account = await User.findOneAndUpdate({_id: userId}, body, {new: true, runValidators: true});
    if (!account) {
        logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - User with id ${userId} does not exist for update_account - ${method} ${_path}`));
        throw new NotFoundError(`Account not found`);
    }
    const token = await account.createJWT();
    account.password = undefined;

    const logData = {
        action: `updateUser - by ${user.role}`,
        resourceName: 'users',
        user: createObjectId(user.id),
        method,
        _path,
    }
    await saveActivityLog(logData);
    logger.info(`${StatusCodes.OK} - ${JSON.stringify(JSON.stringify(user))} - ${method} ${_path}`);
    return res.status(StatusCodes.OK).json({
        message: 'Information updated successfully',
        data: {token, user: account,}
    });
}

const disableUserAccount = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: userId}, user, method, path} = adaptRequest(req);
    const account: any = await User.findById(userId).select(['-password', '-verificationToken']);

    if (!account) {
        logger.info(`${StatusCodes.NOT_FOUND} - No account found with id ${userId} - ${method} ${path}`);
        throw new NotFoundError(`Account not found`);
    }
    checkPermissions(user, account._id);

    account.status = constants.STATUS_DISABLED;
    await account.save();

    const logData = {
        action: `disableUserAccount: ${userId} - by ${user.role}`,
        resourceName: 'users',
        user: createObjectId(user.id),
        method,
        path,
    }
    await saveActivityLog(logData);

    userNamespaceIo.to('users').emit('user:disabled', {userId});
    return res.status(StatusCodes.OK).json({
        message: (user.role === 'admin') ? `${account.firstname} ${account.lastname}'s account disabled successfully` :
            'Account disabled successfully',
    });
}

const enableUserAccount = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: userId}, user, method, path} = adaptRequest(req);
    if (user.role !== constants.role.ADMIN) {
        throw new UnauthorizedError('You are not authorized to perform this action.')
    }

    const account: any = await User.findOneAndUpdate({_id: userId}, {status: constants.STATUS_ENABLED},
        {new: true, runValidators: true}).select(['-password', '-verificationToken']);

    if (!account) {
        logger.info(`${StatusCodes.NOT_FOUND} - No account found with id ${userId} - ${method} ${path}`);
        throw new NotFoundError('Account not found');
    }

    const logData = {
        action: `enableUserAccount: ${userId} - by ${user.role}`,
        resourceName: 'users',
        user: createObjectId(user.id),
        method,
        path,
    }
    await saveActivityLog(logData);
    return res.status(StatusCodes.OK).json({
        message: `${account.firstname} ${account.lastname} account enabled successfully`,
    });
}

const updatePassword = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {body, user: {id: userId, role}, path: _path, method} = adaptRequest(req);
    const {newPassword, oldPassword} = body;

    const {error} = validateUpdatePassword(body);
    if (error) {
        logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {errors: formatValidationError(error)}
        });
    }
    if (newPassword.toLowerCase() === oldPassword.toLowerCase()) {
        throw new BadRequestError('New password must not be the same as old password');
    }
    const user: any = await User.findOne({_id: userId});
    if (!user) {
        throw new UnauthorizedError(`Unauthorized access`);
    }
    const passwordMatch = await user.comparePassword(oldPassword);
    if (!passwordMatch) {
        throw new UnauthorizedError('Password mismatch');
    }
    user.password = newPassword;
    await user.save();

    const logData = {
        action: `updatePassword - by ${role}`,
        resourceName: 'users',
        user: createObjectId(userId),
        method,
        _path,
    }
    await saveActivityLog(logData);
    return res.status(StatusCodes.OK).json({message: 'Password was updated successfully'});
}

export {
    getAllUsers,
    getAllAdmins,
    getUser,
    showCurrentUser,
    updateUser,
    updatePassword,
    getDisabledAccounts,
    enableUserAccount,
    disableUserAccount
}
