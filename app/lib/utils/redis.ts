import Redis from 'ioredis';
import {config} from '../../config/config';
import {logger} from './logger';

let redis: any = '';
const initRedisCache = (): any => {
    if (!redis) {
        redis = new Redis({
            port: config.redis.port as number,
            host: config.redis.host,
            family: config.redis.family as number,
            db: config.redis.db as number,
        })
    }
    return redis;
}

/**
 *
 * @param {string} key the key to set its corresponding value
 * @param {*} value the value to set for the specified key
 * @param {number} ttl the time to live (TTL) in seconds set for the specified key
 * @returns {Promise<void>}
 */
const redisSet = async (key: string, value: any, ttl: number=0) => {
    redis = await initRedisCache();
    if (ttl) {
        return redis.set(key, JSON.stringify(value), 'EX', ttl);
    } else redis.set(key, JSON.stringify(value));
}

/**
 * Retrieves the value of specified key
 * @param {string} key the key to retrieve its value
 * @returns {Promise<*>}
 */
const redisGet = async (key: string): Promise<any> => {
    redis = await initRedisCache();
    return redis.get(key, (err: {message: string}, result: any) => {
        if (err) {
            logger.info(err.message);
        }
        return JSON.parse(result);
    });
}

/**
 * Delete a key from the redis cache
 * @param {string} key the key to delete
 * @returns {Promise<*>}
 */
const redisDelete = async (key: string) => {
    redis = await initRedisCache();
    return redis.del(key);
}

/**
 * Delete all key that match the key pattern specified
 * @param {string} key the key to match
 * @returns {Promise<void>}
 */
const redisRefreshCache = async (key: string): Promise<void> => {
    redis = await initRedisCache();
    redis.keys(`*${key}*`).then(async (properties: any) => {
        for (const property of properties) {
            await redisDelete(property);
        }
    });

}

/**
 * Clears the redis cache
 * @returns {Promise<void>}
 */
const redisFlushAll = async () => {
    redis = await initRedisCache();
    redis.flush();
}

/**
 *  Add records to cache in batch
 * @returns {*}
 * @param key the key to set the batch records
 * @param {number} ttl the time to live (TTL) in seconds set for the specified key
 * @param records
 * @param {boolean} withKey whether to include cache key in record
 */
const redisSetBatchRecords = async (key: string, records: any, ttl: number = 0, withKey: boolean = false): Promise<any> => {
    if (Array.isArray(records) && records.length) {
        redis = await initRedisCache();
        const pipeline = redis.pipeline();
        records.map((record, index) => {
            key = `${key}_${index}`;
            if (withKey) Object.assign(record, {cacheKey: key});
            if (ttl) {
                pipeline.set(key, JSON.stringify(record),  'EX', ttl);
            } else pipeline.set(key, JSON.stringify(record));
        });
        return pipeline.exec();
    }
    return [];
}

/**
 * Get records in cache from batch
 * @param key the key to get the cached batch records
 * @returns {*}
 */
const redisGetBatchRecords = async (key: string): Promise<any[]> => {
    const cachedRecords: any[] = [];
    redis = await initRedisCache();
    const cachedKeys = await redis.keys(`*${key}_*`);
    if (Array.isArray(cachedKeys) && cachedKeys.length) {
        const pipeline = redis.pipeline();
        cachedKeys.map(cachedKey => {
            pipeline.get(cachedKey);
        });
        return pipeline.exec().then((result: any[]) => {
            if (result && result.length) {
                result.map(data => {
                    if (data[1] && data[1] !== '{}') {
                        cachedRecords.push(JSON.parse(data[1]));
                    }
                });
            }
            return cachedRecords;
        })
    }
    return cachedRecords;
}

export {
    redisSet,
    redisGet,
    redisDelete,
    redisRefreshCache,
    redisFlushAll,
    initRedisCache,
    redisSetBatchRecords,
    redisGetBatchRecords
}
