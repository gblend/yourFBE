'use strict';

const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role !== 'admin' && requestUser.id !== resourceUserId.toHexString()) {
        throw new CustomError.UnauthorizedError('You are not authorized to access this resource');
    }
    return true;
}

module.exports = {
    checkPermissions
}
