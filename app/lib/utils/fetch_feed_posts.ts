import { parseString } from 'xml2js';
import { logger, redisSet, request } from '../utils';
import { config } from '../../config/config';

export const fetchFeed = async (feedData: {
  url: string;
  _id: string;
}): Promise<void> => {
  request(feedData, parseData);
};

const parseData = (data: any, feedId?: string): void => {
  if (data) {
    parseString(
      data,
      { mergeAttrs: true },
      async (err: Error | null, result): Promise<void> => {
        if (err) {
          logger.error(
            'An error occurred while parsing feed data',
            err?.message,
          );
          return;
        }

        const feedData = result?.rss?.channel[0];
        if (feedData) {
          await redisSet(`${config.cache.feedPostsKey}_${feedId}`, feedData);
        }
      },
    );
  }
};
