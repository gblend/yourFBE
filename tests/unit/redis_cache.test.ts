import {
    redisDelete,
    redisSet,
    redisFlushAll,
    redisGet,
    initRedisCache
} from '../../app/lib/utils';

describe('Redis', () => {

    const cache = {
        redisDelete,
        redisSet,
        redisFlushAll,
        redisGet,
        initRedisCache
    }

    it('should return redis connection', () => {
        const initCacheSpy = jest.spyOn(cache, 'initRedisCache');
        initCacheSpy.mockImplementation(() => Promise.resolve(() => {}));
        const mockIoredis = cache.initRedisCache();

        expect(mockIoredis).toBeDefined();
        expect(initCacheSpy).toHaveBeenCalledTimes(1);
    });

    it('should return null for non existing cache key', async () => {
        const redisGetSpy = jest.spyOn(cache, 'redisGet');
        redisGetSpy.mockImplementation((key: string) => Promise.resolve(null));
        const cacheValue = await cache.redisGet('test');

        expect(cacheValue).toBe(null);
        expect(redisGetSpy).toHaveBeenCalledTimes(1);
    });

    it('should set value for a provided key', async () => {
        const redisSetSpy = jest.spyOn(cache, 'redisSet');
        redisSetSpy.mockImplementation((key: string) => Promise.resolve('testValue'));
        await cache.redisSet('test', 'testValue');

        expect(redisSetSpy).toHaveBeenCalledTimes(1);
    });

    it('should delete the value for a provided key', async () => {
        const redisDeleteSpy = jest.spyOn(cache, 'redisDelete');
        redisDeleteSpy.mockImplementation((key: string) => Promise.resolve(null));
        await cache.redisDelete('test');

        expect(redisDeleteSpy).toHaveBeenCalledTimes(1);
    });
})

