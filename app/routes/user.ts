import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

import {
    getAllUsers,
    getAllAdmins,
    getUser,
    updateUser,
    updatePassword,
    showCurrentUser,
    enableUserAccount,
    getDisabledAccounts,
    disableUserAccount
} from '../controllers/userController';

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUsers);
router.route('/disabled-accounts').get(authenticateUser, authorizePermissions('admin'), getDisabledAccounts);
router.route('/admins').get(authenticateUser, authorizePermissions('admin'), getAllAdmins);
router.route('/update-password').patch(authenticateUser, updatePassword);
router.route('/accounts/moderate/:id').delete(authenticateUser, authorizePermissions('admin', 'user'), disableUserAccount)
    .patch(authenticateUser, enableUserAccount);
router.route('/me').get(authenticateUser, showCurrentUser);
router.route('/:id').get(authenticateUser, getUser);
router.route('/update/:id').patch(authenticateUser, updateUser);

export default router;
