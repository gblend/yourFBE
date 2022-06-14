const {validateActivityLogDto, ActivityLog} = require('../models/ActivityLog');
const {logger} = require('../lib/utils');
const {StatusCodes} = require('http-status-codes');

const saveActivityLog = async (payload, method = '', path= '') => {
	const {error} = validateActivityLogDto(payload);
	if (!error) {
		await ActivityLog.create(payload);
		logger.info(`${StatusCodes.OK} - ActivityLog saved - ${method} ${path}`);
	}
}

module.exports = {
	saveActivityLog,
}
