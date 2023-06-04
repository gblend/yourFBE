import cron from 'node-cron';
import {pollFeeds} from '../controllers/pollingController';

export const polling = (): void => {
    return cron.schedule('*/15 * * * *', (): void => {
        pollFeeds().then((v: void) => v);
    });
}