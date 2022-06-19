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

module.exports = {
	getActivityLogs,
}
