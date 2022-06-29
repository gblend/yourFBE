'use strict';

const router = require('express').Router();
const {authenticateUser, authorizePermissions} = require('../middleware/authentication');

const {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	disableCategory,
	getCategoryById,
} = require('../controllers/feedCategoryController');

router.route('/').get(getCategories).post(authenticateUser, authorizePermissions('admin'), createCategory);
router.route('/:id').get(getCategoryById).delete(authenticateUser, authorizePermissions('admin'), deleteCategory)
	.patch(authenticateUser, authorizePermissions('admin'), updateCategory);
router.route('/disable/:id').delete(authenticateUser, authorizePermissions('admin'), disableCategory);

module.exports = router;
