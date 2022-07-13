'use strict';

const {StatusCodes} = require('http-status-codes');
const {adaptRequest, logger, paginate} = require('../lib/utils');
const {ActivityLog} = require('../models/ActivityLog');
const {PollingLog} = require('../models/PollingLog');

const getActivityLogs = async (req, res) => {
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

	if (logs.length < 1) {
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

const getActivityLog = async (req, res) => {
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

const getPollingLog = async (req, res) => {
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

const getPollingLogs = async (req, res) => {
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

	if (logs.length < 1) {
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

const searchLogs = async (req, res) => {
	const {queryParams: {type = 'polling', searchTerm, pageSize, pageNumber}, method, path} = adaptRequest(req);

	let query = '';
	let searchResult = [];
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

	if (logs.length < 1) {
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

module.exports = {
	getPollingLogs,
	searchLogs,
	getActivityLog,
	getActivityLogs,
	getPollingLog
}
