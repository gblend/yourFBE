import {validateActivityLogDto, ActivityLog} from '../models/ActivityLog';
import {validatePollingLogDto, PollingLog} from '../models/PollingLog';
import {IActivityDto, IPollingDto} from '../interface'
import {logger} from '../lib/utils';
import {StatusCodes} from 'http-status-codes';

const saveActivityLog = async (activityLog: IActivityDto): Promise<void> => {
	const {error} = validateActivityLogDto(activityLog);
	if (!error) {
		await ActivityLog.create(activityLog);
		logger.info(`${StatusCodes.OK} - ActivityLog saved - ${activityLog.method} ${activityLog.path}`);
	}
}

const savePollingLog = async (pollingLog: IPollingDto): Promise<void> => {
	const {error} = validatePollingLogDto(pollingLog);
	if (!error) {
		await PollingLog.create(pollingLog);
		logger.info(`${StatusCodes.OK} - ActivityLog saved - ${pollingLog.method} ${pollingLog.path}`);
	}
}

export {
	savePollingLog,
	saveActivityLog,
}
