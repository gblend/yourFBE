import {Router} from 'express';
import {authenticateUser, authorizeRoles} from '../middleware';
import {getActivityLog, getActivityLogs, getPollingLog, getPollingLogs, searchLogs} from '../controllers';
import {constants} from '../lib/utils'

const router = Router();
const {ADMIN: admin} = constants.role;

router.route('/activity').get(authenticateUser, authorizeRoles(admin), getActivityLogs);
router.route('/activity/:id').get(authenticateUser, authorizeRoles(admin), getActivityLog);
router.route('/polling').get(authenticateUser, authorizeRoles(admin), getPollingLogs);
router.route('/polling/:id').get(authenticateUser, authorizeRoles(admin), getPollingLog);
router.route('/search').get(authenticateUser, authorizeRoles(admin), searchLogs);

export default router;
