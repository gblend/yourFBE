'use strict';

const {adaptRequest, paginate, logger} = require('../lib/utils');
const {FeedCategory} = require('../models/FeedCategory');
const {Feed} = require('../models/Feed');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError} = require('../lib/errors');

const search = async (req, res) => {
	const {method, path, body: {searchTerm}, queryParams: {sort, pageNumber, pageSize}} = adaptRequest(req);
	if (!searchTerm) {
		throw new BadRequestError('Invalid search term.');
	}

	let searchCategory = FeedCategory.find({$text: {$search: searchTerm}, status: 'enabled'}).select('_id name description');
	let searchFeed = Feed.find({$text: {$search: searchTerm}, status: 'enabled'}).select('_id url title description logoUrl');

	if (sort) {
		const sortFields = sort.split(',').join(' ');
		searchCategory.sort(sortFields);
		searchFeed.sort(sortFields);
	}

	let searchResult = await Promise.all([await searchFeed, await searchCategory]);
	searchResult = searchResult[0].concat(searchResult[1]);

	if (!searchResult.length) {
		logger.info(`${StatusCodes.NOT_FOUND} No result found for: ${searchTerm} - ${method} - ${path}`);
		throw new NotFoundError(`No result found for: ${searchTerm}`)
	}

	const {result, pagination} = await paginate(searchResult, {pageSize, pageNumber});
	logger.info(`${StatusCodes.OK} Search results retrieved successfully - ${method} - ${path}`);
	res.status(StatusCodes.OK).json({message: 'Search results retrieved successfully.', data: {result, pagination}});
}

module.exports = {
	search
}

