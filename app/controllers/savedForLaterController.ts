import {StatusCodes} from 'http-status-codes';
import {SavedForLater, validateSavedForLaterDto} from '../models';
import {config} from '../config/config';
import mongoose from 'mongoose';
import {BadRequestError, NotFoundError} from '../lib/errors';
import {saveActivityLog} from '../lib/dbActivityLog';
import {Request, Response} from '../types';
import {
    adaptPaginateParams,
    adaptRequest,
    createObjectId,
    formatValidationError,
    logger,
    mapPaginatedData,
    paginate,
    redisGetBatchRecords,
    redisRefreshCache,
    redisSetBatchRecords
} from '../lib/utils';
import {userNamespaceIo} from '../socket';

const savePostForLater = async (req: Request, res: Response) => {
    const {body, method, path, user: {id: userId}} = adaptRequest(req);
    body.user = createObjectId(userId);
    body.feed = createObjectId(body.feed);
    const {error} = validateSavedForLaterDto(body);

    if (error) {
        logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
        return res.status(StatusCodes.BAD_REQUEST)
            .json({data: {errors: formatValidationError(error)}});
    }

    const isSavedForLater = await SavedForLater.findOne(body);
    let savedPost: any = {}
    if (!isSavedForLater) {
        savedPost = await SavedForLater.create(body);
        if (!Object.keys(savedPost).length) {
            throw new BadRequestError(`Unable to save post for later. Please try again later.`);
        }
        await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${savedPost._id}`, [savedPost]);
        logger.info(`${StatusCodes.OK} - Post saved for later - ${method} ${path}`);
    }

    userNamespaceIo.to('savedForLater').volatile.emit('admin:post_starred', {post: savedPost, userId});
    res.status(StatusCodes.OK).json({message: 'Post successfully saved for later.', data: {savedForLater: savedPost}});
}

const deletePostSavedForLater = async (req: Request, res: Response) => {
    const {pathParams: {id: postId}, method, path, user: {id: userId, role}} = adaptRequest(req);
    if (!postId || !mongoose.isValidObjectId(postId)) {
        logger.info(`${StatusCodes.BAD_REQUEST} - Invalid post id: ${postId} - ${method} ${path}`);
        throw new BadRequestError('Invalid post id.');
    }

    const deleted = await SavedForLater.findOneAndDelete({_id: postId, user: userId});
    if (!deleted) {
        throw new NotFoundError('Post saved for later not found.')
    }
    await redisRefreshCache(`${config.cache.savePostForLaterCacheKey}_${userId}_${postId}`);

    const logData = {
        action: `deletePostSavedForLater: ${postId} - by ${role}`,
        resourceName: 'saveForLater',
        user: createObjectId(userId),
        method,
        path,
    }
    await saveActivityLog(logData);
    userNamespaceIo.to('savedForLater').volatile.emit('admin:post_deleted', {post: deleted, userId});
    res.status(StatusCodes.OK).json({message: 'Post saved for later successfully removed.'});
}

const getPostsSavedForLater = async (req: Request, res: Response) => {
    const {user: {id: userId}, path, method, queryParams: {pageSize, pageNumber}} = adaptRequest(req);

    let savedPosts: any = await redisGetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}`);
    if (savedPosts && savedPosts.length) {
        logger.info(`${StatusCodes.OK} - Posts saved for later retrieved from cache - ${method} ${path}`);
        const {pagination: _pagination, result: _result} = await paginate(savedPosts, {pageSize, pageNumber});

        return res.status(StatusCodes.OK).json({
            data: {
                savedForLater: _result,
                pagination: _pagination,
            }
        });
    }

    savedPosts = SavedForLater.find({
        user: createObjectId(userId),
        status: {$nin: ['disabled']}
    }).populate('feed', '_id title url logoUrl', 'Feed');
    const {pagination, result} = await paginate(savedPosts, {pageSize, pageNumber});
    const savedPostsData = await result;

    if (!savedPostsData || !savedPostsData.length) {
        return res.status(StatusCodes.NOT_FOUND).json({message: 'No saved posts found.'});
    }

    await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}`, savedPostsData);
    return res.status(StatusCodes.OK).json({
        data: {
            savedForLater: savedPostsData,
            pagination,
        }
    });
}

const getPostSavedForLater = async (req: Request, res: Response) => {
    const {user: {id: userId}, path, method, pathParams: {id: postId}} = adaptRequest(req);
    if (!postId) {
        logger.info(`${StatusCodes.BAD_REQUEST} - Invalid post saved for later id: ${postId} - ${method} ${path}`);
        throw new BadRequestError('Invalid post saved for later id');
    }

    let post: any = await redisGetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${postId}`);
    if (!post.length) {
        post = await SavedForLater.findOne({
            _id: postId,
            status: {$nin: ['disabled']}
        }).populate('feed', '_id title url logoUrl', 'Feed');
        if (!post) {
            throw new NotFoundError('Post saved for later not found.');
        }
        await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${post._id}`, [post]);
    }

    return res.status(StatusCodes.OK).json({
        message: 'Post saved for later retrieved successfully.',
        data: {
            savedForLater: post,
        }
    });
}

const markPostSavedForLaterAsRead = async (req: Request, res: Response) => {
    const {pathParams: {id: postId}, method, path, user: {id: userId}} = adaptRequest(req);

    if (!postId || !mongoose.isValidObjectId(postId)) {
        logger.info(`${StatusCodes.BAD_REQUEST} - Invalid post saved for later id: ${postId} - ${method} ${path}`);
        throw new BadRequestError('Invalid post saved for later id.');
    }

    const post = await SavedForLater.findOneAndUpdate({_id: postId}, {status: 'read'}, {
        runValidators: true,
        new: true
    });
    if (post) {
        await redisSetBatchRecords(`${config.cache.savePostForLaterCacheKey}_${userId}_${postId}`, [post]);
        logger.info(`${StatusCodes.OK} - Post saved for later marked as read - ${method} ${path}`);
        return res.status(StatusCodes.OK).json({
            message: 'Post saved for later successfully marked as read.',
            data: {postData: post}
        });
    }

    res.status(StatusCodes.NOT_FOUND).json({message: 'Post saved for later not found.'});
}

const userStarredFeedPostsStats = async (req: Request, res: Response) => {
    const {user: {id: userId}, path, method, queryParams: {pageSize: _pageSize, pageNumber: _pageNumber}} = adaptRequest(req);
    const {pageSize, pageNumber, offset} = adaptPaginateParams(_pageSize, _pageNumber);

    const starredFeedPostsStat = await SavedForLater.aggregate([
        {
            $match: {status: {$nin: ['disabled']}, user: createObjectId(userId)}
        },
        {
            $lookup: {from: 'feeds', localField: 'feed', foreignField: '_id', as: 'feed'}
        },
        {
            $unwind: '$feed',
        },
        {
            $group: {
                _id: '$feed._id',
                postsCount: {$sum: 1},
                feed: {$first: '$$ROOT'},
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ['$feed', {postsCount: '$postsCount'}]
                }
            }
        },
        {
            $sort: {
                postsCount: -1
            }
        },
        {
            $facet: {
                paginatedResults: [{$skip: offset}, {$limit: pageSize}],
                feeds: [
                    {
                        $count: 'count'
                    }
                ]
            }
        },
    ]);

    if (!starredFeedPostsStat[0]?.paginatedResults.length || !starredFeedPostsStat[0]?.feeds.length) {
        logger.info(`${StatusCodes.NOT_FOUND} - No user starred feed posts found - ${method} ${path}`);
        throw new NotFoundError('No user starred feed posts found');
    }
    const {result, total, pages, next, previous} = mapPaginatedData(starredFeedPostsStat, pageSize, pageNumber);

    logger.info(`${StatusCodes.OK} - User starred feed posts stats fetched successfully - ${method} ${path}`);
    res.status(StatusCodes.OK).json({
        message: 'User starred feed posts stats fetched successfully.',
        data: {
            starredFeedPostsStat: result,
            pagination: {
                pageSize,
                pageNumber,
                offset,
                total,
                pages,
                previous,
                next,
            }
        }
    });
}

const allStarredFeedPostsStats = async (req: Request, res: Response) => {
    const {path, method, queryParams: {pageSize: _pageSize, pageNumber: _pageNumber}} = adaptRequest(req);
    const {pageSize, pageNumber, offset} = adaptPaginateParams(_pageSize, _pageNumber);

    const starredFeedPostsStats = await SavedForLater.aggregate([
        {
            $match: {status: {$nin: ['disabled']}}
        },
        {
            $lookup: {from: 'feeds', localField: 'feed', foreignField: '_id', as: 'feed'}
        },
        {
            $unwind: '$feed',
        },
        {
            $group: {
                _id: '$feed._id',
                postsCount: {$sum: 1},
                feed: {$first: '$$ROOT'},
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ['$feed', {postsCount: '$postsCount'}]
                }
            }
        },
        {
            $sort: {
                postsCount: -1
            }
        },
        {
            $facet: {
                paginatedResults: [{$skip: offset}, {$limit: pageSize}],
                feeds: [
                    {
                        $count: 'count'
                    }
                ]
            }
        },
    ]);

    if (!starredFeedPostsStats[0]?.paginatedResults.length || !starredFeedPostsStats[0]?.feeds.length) {
        logger.info(`${StatusCodes.NOT_FOUND} - No starred feed posts found - ${method} ${path}`);
        throw new NotFoundError('No starred feed posts found');
    }
    const {result, total, pages, next, previous} = mapPaginatedData(starredFeedPostsStats, pageSize, pageNumber);

    logger.info(`${StatusCodes.OK} - All starred feed posts stats fetched successfully - ${method} ${path}`);
    res.status(StatusCodes.OK).json({
        message: 'All starred feed posts stats fetched successfully.',
        data: {
            starredFeedPostsStats: result,
            pagination: {
                pageSize,
                pageNumber,
                offset,
                total,
                pages,
                previous,
                next,
            }
        }
    });
}

export {
    savePostForLater,
    getPostsSavedForLater,
    getPostSavedForLater,
    deletePostSavedForLater,
    userStarredFeedPostsStats,
    allStarredFeedPostsStats,
    markPostSavedForLaterAsRead
}
