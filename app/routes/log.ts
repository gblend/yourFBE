import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

import {getActivityLogs, getActivityLog, getPollingLogs, getPollingLog, searchLogs} from '../controllers/logController';

router.route('/activity').get(authenticateUser, authorizePermissions('admin'), getActivityLogs);
router.route('/activity/:id').get(authenticateUser, authorizePermissions('admin'), getActivityLog);
router.route('/polling').get(authenticateUser, authorizePermissions('admin'), getPollingLogs);
router.route('/polling/:id').get(authenticateUser, authorizePermissions('admin'), getPollingLog);
router.route('/search').get(authenticateUser, authorizePermissions('admin'), searchLogs);

export default router;
