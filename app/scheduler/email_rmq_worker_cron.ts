import cron from 'node-cron';
import { logger } from '../lib/utils';
import { execEmailQueueWorker } from '../lib/scripts/worker/email';

export const rabbitMQEmailWorker = (): void => {
  return cron.schedule('*/15 * * * *', async () => {
    logger.info('Starting rabbitMQ email queue worker...');
    await execEmailQueueWorker();
  });
};
