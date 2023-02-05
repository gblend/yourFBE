import {Router} from 'express';
const router = Router();
import {authenticateUser, authorizePermissions} from '../middleware/authentication';

import {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	disableCategory,
	getCategoryById
} from '../controllers/feedCategoryController';

router.route('/').get(getCategories).post(authenticateUser, authorizePermissions('admin'), createCategory);
router.route('/:id').get(getCategoryById).delete(authenticateUser, authorizePermissions('admin'), deleteCategory)
	.patch(authenticateUser, authorizePermissions('admin'), updateCategory);
router.route('/disable/:id').delete(authenticateUser, authorizePermissions('admin'), disableCategory);

export default router;
