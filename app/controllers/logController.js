const {StatusCodes} = require('http-status-codes');
const {adaptRequest, logger, paginate} = require('../lib/utils');
const {ActivityLog} = require('../models/ActivityLog');
const {PollingLog} = require('../models/PollingLog');

const getActivityLogs = async (req, res) => {
	const {queryParams: {pageSize, pageNumber, sort, fields}} = adaptRequest(req);
	let activityLogs = getActivityLogs.find({});
	// const logsQuery = activityLogs;
	if(sort) {
		const sortFields = sort.split(',').join(' ')
		activityLogs.sort(sortFields)
	}
	if(fields) {
		const requiredFields = fields.split(',').join(' ')
		activityLogs.select(requiredFields)
	}
	let {pagination, result} = paginate(activityLogs,{pageSize, pageNumber});
	const logs = await result;
	// const totalLogs = await logsQuery.estimatedDocumentCount().exec();

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
	let activityLog = ActivityLog.findById(logId);

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

module.exports = {
	getActivityLog,
	getActivityLogs,
}
