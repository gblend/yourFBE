import {UnauthorizedError} from '../errors';
import {ITokenUser} from '../../interface';

const checkPermissions = (requestUser: ITokenUser, resourceUserId: any): boolean => {
    if (requestUser.role !== 'admin' && requestUser.id !== resourceUserId.toHexString()) {
        throw new UnauthorizedError('You are not authorized to access this resource');
    }
    return true;
}

export {
    checkPermissions
}
