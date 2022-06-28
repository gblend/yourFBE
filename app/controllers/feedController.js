'use strict';

const {StatusCodes} = require('http-status-codes');
const {adaptRequest, logger, formatValidationError, paginate, createObjectId} = require('../lib/utils');
const {validateFeedDto, validateFeedUpdateDto, Feed} = require('../models/Feed');
const {saveActivityLog} = require('../lib/dbActivityLog');
const {BadRequestError, NotFoundError} = require('../lib/errors');
const mongoose = require('mongoose');

const getFeedsByCategory = async (req, res) => {
	let {path, method, queryParams: {sort = 'category.name', pageSize = 10, pageNumber = 1}} = adaptRequest(req);
	const feedsByCategory = await Feed.aggregate([
		{
			$match: {
				status: 'enabled'
			}
		},
		{
			$lookup: {from: 'feedcategories', localField: 'category', foreignField: '_id', as: 'category'},
		},
		{
			$unwind: '$category',
		},
		{
			$sort: {[sort]: 1}
		},
		{
			$skip: (pageNumber - 1) * pageSize
		},
		{
			$limit: pageSize
		},
		{
			$group: {
				_id: '$category.name',
				count: {$sum: 1},
				feeds: {$push: '$$ROOT'}
			},
		},
		{ $project: {
				_id: 0,
				category: '$_id',
				count: 1,
				feeds: 1,
			}
		}
	]);

	if (feedsByCategory.length < 1) {
		logger.info(`${StatusCodes.NOT_FOUND} - No feed found for get_feeds_by_category - ${method} ${path}`);
		throw new NotFoundError('No feeds found.');
	}

	logger.info(`${StatusCodes.OK} - Feeds by category fetched successfully - ${method} ${path}`);
	return res.status(StatusCodes.OK).json({message: `Feeds by category fetched successfully.`, data: {feedsByCategory}});
}

module.exports = {
	getFeedsByCategory,
}
