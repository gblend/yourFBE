const {validateActivityLogDto, ActivityLog} = require('../models/ActivityLog');
const {validatePollingLogDto} = require('../models/PollingLog');
const {logger} = require('../lib/utils');
const {StatusCodes} = require('http-status-codes');

const saveActivityLog = async (payload, method = '', path= '') => {
	const {error} = validateActivityLogDto(payload);
	if (!error) {
		await ActivityLog.create(payload);
		logger.info(`${StatusCodes.OK} - ActivityLog saved - ${method} ${path}`);
	}
}

const savePollingLog = async (payload, method = '', path = '') => {
	const {error} = validatePollingLogDto(payload);
	if (!error) {
		await ActivityLog.create(payload);
		logger.info(`${StatusCodes.OK} - ActivityLog saved - ${method} ${path}`);
	}
}

module.exports = {
	savePollingLog,
	saveActivityLog,
}
