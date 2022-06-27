'use strict';

const {StatusCodes} = require('http-status-codes');
const {adaptRequest, logger, paginate, formatValidationError, createObjectId} = require('../lib/utils');
const {FeedCategory, validateFeedCategoryDto} = require('../models/FeedCategory');
const {NotFoundError, CustomAPIError, BadRequestError} = require('../lib/errors');
const mongoose = require('mongoose');
const {saveActivityLog} = require('../lib/dbActivityLog');

const getCategories = async (req, res) => {
	const {method, path, queryParams: {sort, pageSize, pageNumber}} = adaptRequest(req);
	//@TODO check if categories exists in redis cache and query db if not
	const categories = FeedCategory.find({status: 'enabled'}).populate('categoryFeeds', 'id _id', 'Feed');
	//@TODO store fetched categories in redis cache

	if (sort) {
		const sortFields = sort.split(',').join(' ');
		categories.sort(sortFields);
	}

	const {pagination, result} = await paginate(categories, {pageSize, pageNumber});
	const categoriesResult = await result;

	if (categoriesResult.length < 1) {
		logger.info(`${StatusCodes.NOT_FOUND} - No category found - ${method} ${path}`);
		throw new NotFoundError('No category found.');
	}
	res.status(StatusCodes.OK).json({message: 'Categories fetched successfully.', data: {categories: categoriesResult, pagination}});
}

const getCategoryById = async (req, res) => {
	const {method, path, pathParams: {id: categoryId}} = adaptRequest(req);
	//@TODO check if categories exists in redis cache and query db if not
	const category = await FeedCategory.findById(categoryId).populate('categoryFeeds', 'id _id', 'Feed');
	if (!category) {
		logger.info(`${StatusCodes.NOT_FOUND} - Category not found - ${method} ${path}`);
		throw new NotFoundError('Category not found.');
	}

	res.status(StatusCodes.OK).json({message: 'Category fetched successfully.', data: {category}});
}

const createCategory = async (req, res) => {
	const {body, method, path, user: {id: userId, role}} = adaptRequest(req);
	body.user = createObjectId(userId);
	const {error} = validateFeedCategoryDto(body);

	if (error) {
		logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
		return res.status(StatusCodes.BAD_REQUEST).json({ data: {error: formatValidationError(error)}});
	}

	const category = await FeedCategory.create(body);
	if (!category) {
		throw new CustomAPIError('Unable to create feed category. Please try again later.')
	}

	const logData = {
		action: `createCategory - by ${role}`,
		resourceName: 'FeedCategory',
		user:createObjectId(userId),
	}
	await saveActivityLog(logData, method, path);

	logger.info(`${StatusCodes.OK} - Category created successfully - ${method} ${path}`);
	res.status(StatusCodes.OK).json({ message: 'Category created successfully.', data: {category}})
}

module.exports = {
	getCategories,
	createCategory,
	getCategoryById,
}
