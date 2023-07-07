import { adaptRequest, createObjectId, logger } from '../lib/utils';
import { Feed, FeedCategory, FollowedFeed, SavedForLater } from '../models';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '../types';

const userDashboardStats = async (req: Request, res: Response) => {
  const {
    pathParams: { id: userId },
    method,
    path,
  } = adaptRequest(req);

  const followedFeedsByCategory = await FollowedFeed.aggregate([
    {
      $match: { user: createObjectId(userId) },
    },
    {
      $lookup: {
        from: 'feeds',
        localField: 'feed',
        foreignField: '_id',
        as: 'feed',
      },
    },
    {
      $unwind: '$feed',
    },
    {
      $group: {
        _id: '$feed.category',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
      },
    },
  ]);

  const totalSavedForLater = await SavedForLater.find({
    user: userId,
    status: 'enabled',
  }).countDocuments();
  const totalFollowedFeed = followedFeedsByCategory.reduce(
    (accumulator, object) => accumulator + object.count,
    0,
  );

  logger.info(
    `${StatusCodes.OK} - Stats fetched successfully - ${method} ${path}`,
  );
  res.status(StatusCodes.OK).json({
    message: 'Stats fetched successfully.',
    data: {
      stats: {
        totalFollowedFeed,
        totalFollowedFeedCategory: followedFeedsByCategory.length,
        totalSavedForLater,
      },
    },
  });
};

const adminDashboardStats = async (req: Request, res: Response) => {
  const { method, path } = adaptRequest(req);

  const feedsCount = await Feed.find({ status: 'enabled' }).countDocuments();
  const followedFeedsCount = await FollowedFeed.find({}).countDocuments();
  const categoriesCount = await FeedCategory.find({
    status: 'enabled',
  }).countDocuments();

  const [totalFeed, totalFeedFollows, totalCategory] = await Promise.all([
    feedsCount,
    followedFeedsCount,
    categoriesCount,
  ]);

  logger.info(
    `${StatusCodes.OK} - Stats fetched successfully - ${method} ${path}`,
  );
  res.status(StatusCodes.OK).json({
    message: 'Stats fetched successfully.',
    data: {
      stats: {
        totalFeed,
        totalFeedFollows,
        totalCategory,
      },
    },
  });
};

export { userDashboardStats, adminDashboardStats };
