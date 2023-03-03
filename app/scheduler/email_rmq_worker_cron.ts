import cron from 'node-cron';
import {logger} from '../lib/utils';
import {execEmailQueueWorker} from '../lib/scripts/worker/email';

const rabbitMQEmailWorker = (): void => {
    return cron.schedule('*/5 * * * *', async () => {
        logger.info('Starting rabbitMQ email queue worker...');
        await execEmailQueueWorker();
    });
};

export {
    rabbitMQEmailWorker
}
