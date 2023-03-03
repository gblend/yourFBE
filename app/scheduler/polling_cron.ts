import cron from 'node-cron';
import {logger} from '../lib/utils';

const polling = (): void => {
    return cron.schedule('*/15 * * * *', () => {
        logger.info('Starting polling for feed posts...');
    });
};

export {
    polling
}
