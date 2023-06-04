import {Router} from 'express';
import {authenticateUser, authorizeRoles} from '../middleware';
import {constants} from '../lib/utils'
import {
    createCategory,
    deleteCategory,
    disableCategory,
    getCategories,
    getCategoryById,
    updateCategory
} from '../controllers';

const router = Router();

const {ADMIN: admin} = constants.role;

router.route('/').get(getCategories).post(authenticateUser, authorizeRoles(admin), createCategory);
router.route('/:id').get(getCategoryById).delete(authenticateUser, authorizeRoles(admin), deleteCategory)
    .patch(authenticateUser, authorizeRoles(admin), updateCategory);
router.route('/disable/:id').delete(authenticateUser, authorizeRoles(admin), disableCategory);

export default router;
