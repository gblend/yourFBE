import {Router} from 'express';
import {authenticateUser, authorizeRoles} from '../middleware';
import {createNotification, deleteNotification, getNotifications, updateNotification} from '../controllers';
import {constants} from '../lib/utils'

const router = Router();

const {ADMIN: admin} = constants.role;

router.route('/')
    .get(authenticateUser, authorizeRoles(admin), getNotifications)
    .post(authenticateUser, authorizeRoles(admin), createNotification);
router.route('/:id')
    .delete(authenticateUser, authorizeRoles(admin), deleteNotification)
    .patch(authenticateUser, authorizeRoles(admin), updateNotification);

export default router;
