import {Feed} from '../models';
import {fetchFeed, logger, redisGet} from '../lib/utils';
import {logScheduledProcess} from './scheduleController';
import {config} from '../config/config';

const feedsPollingCronCacheKey: string = config.cache.feedsPollingCronKey;
type feed = { url: string, _id: string };

class RSSFeedPollingQueue {
    private readonly concurrent: number;
    private readonly feeds: any[];
    private readonly running: any[];
    private readonly completed: any[];
    private readonly requestClient: any;

    constructor(client: (feedData: feed) => Promise<any>, feeds: any[] = [], concurrentCount: number = 1) {
        this.concurrent = concurrentCount;
        this.feeds = feeds;
        this.requestClient = client;
        this.running = [];
        this.completed = [];
    }

    get runNew() {
        return (this.running.length < this.concurrent) && this.feeds.length;
    }

    run(): void {
        while (this.runNew) {
            const feedData: feed = this.feeds.shift();
            logger.info(`Initiating polling to ${feedData.url}`);
            this.running.push(feedData);
            if (this.requestClient(feedData)) {
                this.completed.push(this.running.shift());
            } else {
                this.running.shift();
                this.feeds.push(feedData);
            }
            if (this.feeds.length < 1) {
                logScheduledProcess(feedsPollingCronCacheKey, true).then(r => r);
            }
        }
    }
}

const getFeedsData = async (limit: number = 1000): Promise<any> => {
    return Feed.aggregate([
        {
            $match: {
                status: 'enabled',
            }
        },
        {
            $limit: limit
        },
        {
            $project: {
                _id: 1,
                url: 1
            }
        }
    ]);
}

export const pollFeeds = async (): Promise<void> => {
    logScheduledProcess(feedsPollingCronCacheKey).then(async (scheduleRunning: boolean): Promise<void> => {
        const processScheduled: boolean = JSON.parse(await redisGet(feedsPollingCronCacheKey));

        if (!processScheduled) {
            logger.info('Feed Polling In Progress')
            const feeds: feed[] = await getFeedsData();

            if (feeds.length) {
                const feedsIds: string[] = feeds.map((feedData: feed): string => feedData._id);
                logger.info(`${feeds.length} feeds data retrieved successfully, proceeding to poll feeds posts.`);

                const rssFeedPollingQueue = new RSSFeedPollingQueue(fetchFeed, feeds);
                rssFeedPollingQueue.run();
                await Feed.updateMany({_id: feedsIds}, {$set: {updatedAt: new Date(Date.now())}});
            }
        }
    });
}