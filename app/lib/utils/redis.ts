import Redis from 'ioredis';
import {config} from '../../config/config';
import {logger} from './logger';

let redis: any = '';

interface IConnectionOptions {
    port?: number,
    host?: string,
    family?: number,
    db?: number,
    password?: string,
}

const connectionOptions: IConnectionOptions = {
    port: 17402,
    host: 'redis-17402.c10.us-east-1-2.ec2.cloud.redislabs.com',
    password: 'Ix6av7JtrburyRgqxti81flgUA3v6m03',
    family: config.redis.family as number,
    db: config.redis.db as number,
}

const getRedisConnection = () => {
    return initRedisCache(connectionOptions);
}

const initRedisCache = (connectionOption: IConnectionOptions = {}): any => {
    if (!redis) {
        redis = new Redis(connectionOption)
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
const redisSet = async (key: string, value: any, ttl: number = 0) => {
    redis = getRedisConnection();
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
    redis = getRedisConnection();
    return redis.get(key, (err: { message: string }, result: any) => {
        if (err) {
            logger.info(err.message);
        }
        return JSON.parse(result);
    });
}

/**
 * Retrieves the value of multiple keys
 * @param {array} keys the keys to retrieve their value
 * @returns {Promise<*>}
 */
const redisMGet = async (keys: string[]): Promise<any> => {
    redis = getRedisConnection();
    const result = await redis.mget(keys);
    return result.filter((data: any) => (data !== null && typeof data !== 'object'));
}

/**
 * Delete a key from the redis cache
 * @param {string} key the key to delete
 * @returns {Promise<*>}
 */
const redisDelete = async (key: string) => {
    redis = getRedisConnection();
    return redis.del(key);
}

/**
 * Delete all key that match the key pattern specified
 * @param {string} key the key to match
 * @returns {Promise<void>}
 */
const redisRefreshCache = async (key: string): Promise<void> => {
    redis = getRedisConnection();
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
    redis = await getRedisConnection();
    redis.flushall();
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
        redis = getRedisConnection();
        const pipeline = redis.pipeline();
        records.map((record, index: number): void => {
            key = `${key}_${index}`;
            if (withKey) Object.assign(record, {cacheKey: key});
            if (ttl) {
                pipeline.set(key, JSON.stringify(record), 'EX', ttl);
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
    redis = getRedisConnection();
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
    redisMGet,
    redisDelete,
    redisRefreshCache,
    redisFlushAll,
    initRedisCache,
    getRedisConnection,
    redisSetBatchRecords,
    redisGetBatchRecords
}
