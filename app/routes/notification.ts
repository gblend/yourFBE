import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';
import {
	createNotification,
	deleteNotification,
	updateNotification,
	getNotifications
} from '../controllers/notificationController';

router.route('/')
	.get(authenticateUser, authorizePermissions('admin'), getNotifications)
	.post(authenticateUser, authorizePermissions('admin'), createNotification);
router.route('/:id')
	.delete(authenticateUser, authorizePermissions('admin'), deleteNotification)
	.patch(authenticateUser, authorizePermissions('admin'), updateNotification);

export default router;
