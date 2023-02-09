import {
    redisDelete,
    redisSet,
    redisFlushAll,
    redisRefreshCache,
    redisGet,
    redisGetBatchRecords,
    redisSetBatchRecords,
    initRedisCache
} from '../../app/lib/utils';

describe('Redis', () => {
    it('should return redis connection', function () {
        const redis = initRedisCache();

        expect(redis).toBeDefined;
    });
})

