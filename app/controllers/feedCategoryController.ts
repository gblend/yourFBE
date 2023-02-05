import {StatusCodes} from 'http-status-codes';
import {adaptRequest, logger, paginate, formatValidationError, createObjectId, constants} from '../lib/utils';
import {FeedCategory, validateFeedCategoryDto} from '../models/FeedCategory';
import {NotFoundError, BadRequestError} from '../lib/errors';
import {Request, Response} from '../types/index';
import mongoose from 'mongoose';
import {io} from '../socket';
import {saveActivityLog} from '../lib/dbActivityLog';
import {IResponse} from '../interface';
import {config} from "../config/config";
const feedCategoryRoom: string = config.socket.group.categories;
const feedCategoryEvent = config.socket.events.feedCategory;

const getCategories = async (req: Request, res: Response): Promise<void> => {
	const {method, path, queryParams: {sort, pageSize, pageNumber}} = adaptRequest(req);
	//@TODO check if categories exists in redis cache and query db if not
	const categories = FeedCategory.find({status: constants.STATUS_ENABLED}).populate('feedsCount');
	//@TODO store fetched categories in redis cache

	if (sort) {
		const sortFields = sort.split(',').join(' ');
		categories.sort(sortFields);
	}

	const {pagination, result} = await paginate(categories, {pageSize, pageNumber});
	const categoriesResult = await result;

	if (!categoriesResult.length) {
		logger.info(`${StatusCodes.NOT_FOUND} - No category found - ${method} ${path}`);
		throw new NotFoundError('No category found.');
	}
	res.status(StatusCodes.OK).json({message: 'Categories fetched successfully.', data: {categories: categoriesResult, pagination}});
}

const getCategoryById = async (req: Request, res: Response) => {
	const {method, path, pathParams: {id: categoryId}} = adaptRequest(req);
	//@TODO check if categories exists in redis cache and query db if not
	const category = await FeedCategory.findById(categoryId, {status: constants.STATUS_ENABLED}).populate('feeds',
		'_id url title description logoUrl user createdAt updatedAt', 'Feed', {status: constants.STATUS_ENABLED});
	if (!category) {
		logger.info(`${StatusCodes.NOT_FOUND} - Category not found - ${method} ${path}`);
		throw new NotFoundError('Category not found.');
	}

	res.status(StatusCodes.OK).json({message: 'Category fetched successfully.', data: {category}});
}

const createCategory = async (req: Request, res: Response): Promise<Response<IResponse> | any> => {
	const {body, method, path, user: {id: userId, role}} = adaptRequest(req);
	const {error} = validateFeedCategoryDto(body);

	if (error) {
		logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
		return res.status(StatusCodes.BAD_REQUEST).json({ data: {error: formatValidationError(error)}});
	}

	const isCategoryExist = await FeedCategory.findOne(body);
	let createdCategory = {}
	if (!isCategoryExist) {
		createdCategory = await FeedCategory.create(body);
		if (!Object.keys(createdCategory).length) {
			throw new BadRequestError(`Unable to create category. Please try again later.`);
		}
		const logData = {
			action: `createCategory - by ${role}`,
			resourceName: 'FeedCategory',
			user: createObjectId(userId),
			method,
			path,
		}
		await saveActivityLog(logData);

		logger.info(`${StatusCodes.OK} - Category created successfully - ${method} ${path}`);
	}

	io.to(feedCategoryRoom).emit(feedCategoryEvent.created, {category: createdCategory});
	res.status(StatusCodes.OK).json({ message: 'Category created successfully.', data: {category: createdCategory}})
}

const disableCategory = async (req: Request, res: Response): Promise<void> => {
	const {pathParams: {id: categoryId}, method, path, user: {id: userId, role}} = adaptRequest(req);

	if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid category id - ${method} ${path}`);
		throw new BadRequestError('Invalid category id.');
	}

	const category = await FeedCategory.findById(categoryId);
	if (!category) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Category not found - ${method} ${path}`);
		throw new BadRequestError('Category not found.');
	}

	category.status = constants.STATUS_DISABLED;
	await category.save();

	//@TODO: clear disabled category from redis cached categories
	const logData = {
		action: `disableCategory: ${categoryId} - by ${role}`,
		resourceName: 'FeedCategory',
		user: createObjectId(userId),
		method,
		path,
	}
	await saveActivityLog(logData);

	io.to(feedCategoryRoom).emit(feedCategoryEvent.disabled, {categoryId});
	res.status(StatusCodes.OK).json({ message: 'Category disabled successfully.'});
}

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
	const {pathParams: {id: categoryId}, method, path, user: {id: userId, role}} = adaptRequest(req);

	if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid category id - ${method} ${path}`);
		throw new BadRequestError('Invalid category id.');
	}
logger.info('Category is ' + categoryId);
	const deleted = await FeedCategory.findOneAndDelete({_id: categoryId});
	if (!deleted) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid category id - ${method} ${path}`);
		throw new BadRequestError(`Invalid category id: ${categoryId}`);
	}

	//@TODO: clear deleted category from redis cached categories
	const logData = {
		action: `deleteCategory: ${categoryId} - by ${role}`,
		resourceName: 'FeedCategory',
		user: createObjectId(userId),
		method,
		path,
	}
	await saveActivityLog(logData);

	io.to(feedCategoryRoom).emit(feedCategoryEvent.deleted, {categoryId});
	res.status(StatusCodes.OK).json({ message: 'Category deleted successfully.'});
}

const updateCategory = async (req: Request, res: Response): Promise<void> => {
	const {body, pathParams: {id: categoryId}, method, path, user: {id: userId, role}} = adaptRequest(req);

	if (!categoryId || !mongoose.isValidObjectId(categoryId)) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Invalid category id - ${method} ${path}`);
		throw new BadRequestError('Invalid category id.');
	}

	const updatedCategory = await FeedCategory.findOneAndUpdate({_id: categoryId}, body, {runValidators: true, new: true});
	if (!updatedCategory) {
		logger.info(`${StatusCodes.BAD_REQUEST} - Unable to update category - ${method} ${path}`);
		throw new BadRequestError('Category not found.');
	}
	//@TODO: clear updated category from redis cached categories
	const logData = {
		action: `updateCategory: ${categoryId} - by ${role}`,
		resourceName: 'FeedCategory',
		user: createObjectId(userId),
		method,
		path,
	}
	await saveActivityLog(logData);

	io.to(feedCategoryRoom).emit(feedCategoryEvent.updated, {category: updatedCategory});
	res.status(StatusCodes.OK).json({ message: 'Category updated successfully.', date: {category: updatedCategory}});
}

export {
	getCategories,
	createCategory,
	disableCategory,
	deleteCategory,
	updateCategory,
	getCategoryById
}
