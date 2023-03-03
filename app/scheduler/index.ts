import {polling} from './polling_cron';
import {rabbitMQEmailWorker} from './email_rmq_worker_cron';

const initCron = (): void => {
    polling();
    rabbitMQEmailWorker();
}

export {
    initCron
}
