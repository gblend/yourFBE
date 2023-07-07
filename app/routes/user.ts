import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware';

import {
  disableUserAccount,
  enableUserAccount,
  getAllAdmins,
  getAllUsers,
  getDisabledAccounts,
  getUser,
  showCurrentUser,
  updatePassword,
  updateUser,
  uploadProfileImage,
} from '../controllers';
import { constants } from '../lib/utils';

const router = Router();
const { ADMIN: admin, USER: user } = constants.role;

router.route('/').get(authenticateUser, authorizeRoles(admin), getAllUsers);
router
  .route('/disabled-accounts')
  .get(authenticateUser, authorizeRoles(admin), getDisabledAccounts);
router
  .route('/admins')
  .get(authenticateUser, authorizeRoles(admin), getAllAdmins);
router.route('/update-password').patch(authenticateUser, updatePassword);
router
  .route('/accounts/moderate/:id')
  .delete(authenticateUser, authorizeRoles(admin, user), disableUserAccount)
  .patch(authenticateUser, enableUserAccount);
router.route('/upload/image').post(authenticateUser, uploadProfileImage);
router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/:id').get(authenticateUser, getUser);
router
  .route('/update/account')
  .patch(authenticateUser, authorizeRoles(admin, user), updateUser);
router
  .route('/update/:id')
  .patch(authenticateUser, authorizeRoles(admin, user), updateUser);

export default router;
