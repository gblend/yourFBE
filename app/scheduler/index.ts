import { polling } from './polling_cron';
import { rabbitMQEmailWorker } from './email_rmq_worker_cron';

export const initCron = (): void => {
  polling();
  rabbitMQEmailWorker();
};
