import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware';
import {
  createConfig,
  deleteConfig,
  disableConfig,
  getAllConfig,
  getConfigByPath,
  getSingleConfig,
  updateConfig,
} from '../controllers';
import { constants } from '../lib/utils';

const router = Router();

const { ADMIN: admin } = constants.role;

router
  .route('/')
  .post(authenticateUser, authorizeRoles(admin), createConfig)
  .get(authenticateUser, authorizeRoles(admin), getAllConfig);
router
  .route('/:id')
  .get(authenticateUser, authorizeRoles(admin), getSingleConfig)
  .patch(authenticateUser, authorizeRoles(admin), updateConfig)
  .delete(authenticateUser, authorizeRoles(admin), deleteConfig);
router
  .route('/meta/path')
  .get(authenticateUser, authorizeRoles(admin), getConfigByPath);
router
  .route('/disable/:id')
  .patch(authenticateUser, authorizeRoles(admin), disableConfig);

export default router;
