import {StatusCodes} from 'http-status-codes';
import {adaptRequest, logger, paginate} from '../lib/utils';
import {ActivityLog} from '../models/ActivityLog';
import {PollingLog} from '../models/PollingLog';
import {Response, Request} from '../types'

const getActivityLogs = async (req: Request, res: Response) => {
	const {queryParams: {pageSize, pageNumber, sort, fields}, method, path} = adaptRequest(req);
	let activityLogs = ActivityLog.find();

	if(sort) {
		const sortFields = sort.split(',').join(' ')
		activityLogs.sort(sortFields)
	}
	if(fields) {
		const requiredFields = fields.split(',').join(' ')
		activityLogs.select(requiredFields)
	}
	let {pagination, result} = await paginate(activityLogs,{pageSize, pageNumber});
	const logs = await result;

	if (!logs.length) {
		logger.info(`${StatusCodes.NOT_FOUND} - Activity logs not found. - ${method} ${path}`)
		return res.status(StatusCodes.NOT_FOUND).json({message: `Activity logs not found.`})
	}
	res.status(StatusCodes.OK).json({
		message: 'Activity logs fetched successfully.',
		data: {
			logs,
			pagination
		}
	});
}

const getActivityLog = async (req: Request, res: Response) => {
	const {pathParams: {id: logId}, path, method} = adaptRequest(req);
	let activityLog = await ActivityLog.findById(logId);

	if (!activityLog) {
		logger.info(`${StatusCodes.NOT_FOUND} - Activity log with id ${logId} does not exist. - ${method} ${path}`)
		return res.status(StatusCodes.NOT_FOUND).json({message: `Activity log with id ${logId} does not exist.`})
	}

	res.status(StatusCodes.OK).json({
		message: 'Activity log fetched successfully.',
		data: {
			activityLog,
		}
	});
}

const getPollingLog = async (req: Request, res: Response) => {
	const {pathParams: {id: logId}, path, method} = adaptRequest(req);
	let pollingLog = await PollingLog.findById(logId);

	if (!pollingLog) {
		logger.info(`${StatusCodes.NOT_FOUND} - Polling log with id ${logId} does not exist. - ${method} ${path}`)
		return res.status(StatusCodes.NOT_FOUND).json({message: `Polling log with id ${logId} does not exist.`,})
	}

	res.status(StatusCodes.OK).json({
		message: 'Polling log fetched successfully.',
		data: {
			pollingLog,
		}
	});
}

const getPollingLogs = async (req: Request, res: Response) => {
	const {method, path, queryParams: {sort, fields, pageSize, pageNumber}} = adaptRequest(req);
	let pollingLogs = PollingLog.find({});

	if(sort) {
		const sortFields = sort.split(',').join(' ')
		pollingLogs.sort(sortFields)
	}
	if(fields) {
		const requiredFields = fields.split(',').join(' ')
		pollingLogs.select(requiredFields)
	}

	let {pagination, result} = await paginate(pollingLogs, {pageSize, pageNumber});
	const logs = await result;

	if (!logs.length) {
		logger.info(`${StatusCodes.NOT_FOUND} - Polling logs no found. - ${method} ${path}`)
		return res.status(StatusCodes.NOT_FOUND).json({message: `Polling logs not found.`})
	}
	res.status(StatusCodes.OK).json({
		message: 'Activity logs fetched successfully.',
		data: {
			logs,
			pagination
		}
	});
}

const searchLogs = async (req: Request, res: Response) => {
	const {queryParams: {type = 'polling', searchTerm, pageSize, pageNumber}, method, path} = adaptRequest(req);

	let query: any = '';
	let searchResult: any = [];
	if (searchTerm && type === 'polling') {
		query = {
		$or: [
			{
				url: {$regex: searchTerm, $options: 'i'}
			},
			{
				status: {$regex: searchTerm, $options: 'i'}
			},
		]
		}

		searchResult = PollingLog.find(query);
	} else if (searchTerm && type === 'activity') {
		query = {
			$or: [
				{
					action: {$regex: searchTerm, $options: 'i'}
				},
				{
					resourceName: {$regex: searchTerm, $options: 'i'}
				},
			]
		}

		searchResult = ActivityLog.find(query);
	}

	let {pagination, result} = await paginate(searchResult, {pageSize, pageNumber});
	const logs = await result;

	if (!logs.length) {
		logger.info(`${StatusCodes.NOT_FOUND} - No result found for ${type} logs search. - ${method} ${path}`)
		return res.status(StatusCodes.NOT_FOUND).json({message: `No result found for ${type} logs search.`})
	}
	res.status(StatusCodes.OK).json({
		message: 'Logs search result fetched successfully.',
		data: {
			logs,
			pagination
		}
	});
}

export {
	getPollingLogs,
	searchLogs,
	getActivityLog,
	getActivityLogs,
	getPollingLog
}
