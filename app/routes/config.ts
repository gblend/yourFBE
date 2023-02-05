import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

import {
	getAllConfig,
	createConfig,
	getSingleConfig,
	updateConfig,
	disableConfig,
	deleteConfig,
	getConfigByPath
} from '../controllers/configController';


router.route('/').post(authenticateUser, authorizePermissions('admin'), createConfig)
	.get(authenticateUser, authorizePermissions('admin'), getAllConfig);
router.route('/:id').get(authenticateUser, authorizePermissions('admin'), getSingleConfig)
	.patch(authenticateUser, authorizePermissions('admin'), updateConfig)
	.delete(authenticateUser, authorizePermissions('admin'), deleteConfig);
router.route('/meta/path').get(authenticateUser, authorizePermissions('admin'), getConfigByPath);
router.route('/disable/:id').patch(authenticateUser, authorizePermissions('admin'), disableConfig);

export default router;
