import {adaptRequest, paginate, logger, constants} from '../lib/utils';
import {FeedCategory} from '../models/FeedCategory';
import {Feed} from '../models/Feed';
import {StatusCodes} from 'http-status-codes';
import {NotFoundError, BadRequestError} from '../lib/errors';
import {Request, Response} from '../types';

const search = async (req: Request, res: Response) => {
	const {method, path, body: {searchTerm}, queryParams: {sort, pageNumber, pageSize}} = adaptRequest(req);
	if (!searchTerm) {
		throw new BadRequestError('Invalid search term.');
	}

	let searchCategory = FeedCategory.find({status: constants.STATUS_ENABLED, $text: {$search: searchTerm}}).select('_id name description');
	let searchFeed = Feed.find({status: constants.STATUS_ENABLED, $text: {$search: searchTerm}})
		.populate({path: 'category', select: ['_id', 'name', 'description']})
		.select('_id url title description logoUrl category');

	if (sort) {
		const sortFields = sort.split(',').join(' ');
		searchCategory.sort(sortFields);
		searchFeed.sort(sortFields);
	}

	const search = await Promise.all([await searchFeed, await searchCategory]);
	const searchResult = [...search[0], ...search[1]];

	if (!searchResult.length) {
		logger.info(`${StatusCodes.NOT_FOUND} No result found for: ${searchTerm} - ${method} - ${path}`);
		throw new NotFoundError(`No result found for: ${searchTerm}`)
	}

	const {result, pagination} = await paginate(searchResult, {pageSize, pageNumber});
	logger.info(`${StatusCodes.OK} Search results retrieved successfully - ${method} - ${path}`);
	res.status(StatusCodes.OK).json({message: 'Search results retrieved successfully.', data: {result, pagination}});
}

export {
	search
}

