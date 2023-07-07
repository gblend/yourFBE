import { UnauthorizedError } from '../errors';
import { ITokenUser } from '../../interface';
import { constants } from './constant';

export const checkPermissions = (
  requestUser: ITokenUser,
  resourceUserId: any,
): boolean => {
  if (
    requestUser.role !== constants.role.ADMIN &&
    requestUser.id !== resourceUserId.toHexString()
  ) {
    throw new UnauthorizedError(
      'You are not authorized to access this resource',
    );
  }
  return true;
};
