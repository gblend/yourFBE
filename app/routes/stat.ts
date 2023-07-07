import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware';
import { adminDashboardStats, userDashboardStats } from '../controllers';
import { constants } from '../lib/utils';

const router = Router();

const { ADMIN: admin } = constants.role;

router
  .route('/admin')
  .get(authenticateUser, authorizeRoles(admin), adminDashboardStats);
router.route('/users/:id').get(authenticateUser, userDashboardStats);

export default router;
