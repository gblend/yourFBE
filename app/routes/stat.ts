import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

import {adminDashboardStats, userDashboardStats} from '../controllers/statisticController.js';

router.route('/admin').get(authenticateUser, authorizePermissions('admin'), adminDashboardStats);
router.route('/users/:id').get(authenticateUser, userDashboardStats);

export default router;
