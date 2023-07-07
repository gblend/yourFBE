import { StatusCodes } from 'http-status-codes';
import {
  adaptRequest,
  constants,
  createObjectId,
  extractSocketUsers,
  formatValidationError,
  logger,
  paginate,
  redisRefreshCache,
  redisSetBatchRecords,
} from '../lib/utils';
import {
  Notification,
  NotificationLog,
  validateNotificationDto,
  validateNotificationLogDto,
  validateUpdateNotificationDto,
} from '../models';
import { saveActivityLog } from '../lib/dbActivityLog';
import { BadRequestError, NotFoundError } from '../lib/errors';
import mongoose from 'mongoose';
import { objectId, Request, Response } from '../types';
import { userNamespaceIo } from '../socket';
import { config } from '../config/config';

const notificationRoom = config.socket.group.notifications;
const notificationEvent = config.socket.events.notification;

const createNotification = async (req: Request, res: Response) => {
  const { body, path, method, user } = adaptRequest(req);
  const { error } = validateNotificationDto(body);

  if (error) {
    logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: { errors: formatValidationError(error) } });
  }

  const notification = await Notification.findOneAndUpdate(
    { title: body.title, text: body.text },
    body,
    { upsert: true, new: true },
  );

  if (!notification) {
    throw new BadRequestError(
      `Unable to create notification. Please try again later.`,
    );
  }

  const logData = {
    action: `createNotification: ${notification._id} - by ${user.role}`,
    resourceName: 'Notification',
    user: createObjectId(user.id),
    method,
    path,
  };
  await saveActivityLog(logData);
  logger.info(`${StatusCodes.OK} - Notification created - ${method} ${path}`);

  const socketInstances: any = await userNamespaceIo.fetchSockets();
  const activeSocketIds: string = await extractSocketUsers(socketInstances);
  // emit notification to all active sockets
  userNamespaceIo
    .to(notificationRoom)
    .emit(notificationEvent.generated, { notification });
  // get comma separated string of all active sockets id and save them into notification log
  if (activeSocketIds) {
    const notificationLogData = {
      users: activeSocketIds,
      notification: createObjectId(notification._id) as objectId,
    };
    const { error: errors } = validateNotificationLogDto(notificationLogData);
    if (errors) {
      logger.info(
        JSON.stringify(JSON.stringify(formatValidationError(errors))),
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ data: { errors: formatValidationError(errors) } });
    }

    const newNotification = await NotificationLog.findOneAndUpdate(
      { notification: notificationLogData.notification },
      notificationLogData,
      { upsert: true, new: true },
    );

    if (newNotification) {
      const notifications = await NotificationLog.find({})
        .select('users _id notification')
        .lean();
      // save all sent notifications data in redis for faster lookup
      await redisSetBatchRecords(
        config.cache.notificationsSentKey,
        notifications,
        0,
        true,
      );
    }
  }

  res.status(StatusCodes.OK).json({
    message: 'Notification created and sent successfully.',
    data: { notification },
  });
};

const getNotifications = async (req: Request, res: Response) => {
  const {
    path,
    method,
    queryParams: { pageSize, pageNumber },
  } = adaptRequest(req);
  const notifications = Notification.find({
    status: constants.STATUS_ENABLED,
  }).select('_id title text createdAt');

  const { pagination, result } = await paginate(notifications, {
    pageSize,
    pageNumber,
  });
  const notificationsResult = await result;

  if (!notificationsResult.length) {
    logger.info(
      `${StatusCodes.NOT_FOUND} - No notification found for get_notifications - ${method} ${path}`,
    );
    throw new NotFoundError('No notification found.');
  }
  logger.info(
    `${StatusCodes.OK} - Notifications fetched successfully - ${method} ${path}`,
  );
  return res.status(StatusCodes.OK).json({
    message: 'Notifications fetched successfully.',
    data: { notifications: notificationsResult, pagination },
  });
};

const deleteNotification = async (req: Request, res: Response) => {
  const {
    path,
    method,
    pathParams: { id: notificationId },
    user,
  } = adaptRequest(req);
  if (!notificationId || !mongoose.isValidObjectId(notificationId)) {
    throw new BadRequestError('Invalid notification id.');
  }
  const deletedNotification = await Notification.findOneAndDelete({
    _id: notificationId,
  });
  if (!deletedNotification) {
    throw new BadRequestError(
      'Notification was not deleted. Please confirm notification id is valid.',
    );
  }

  const logData = {
    action: `deleteFeed: ${notificationId} - by ${user.role}`,
    resourceName: 'notifications',
    user: createObjectId(user.id),
    method,
    path,
  };
  await saveActivityLog(logData);
  logger.info(
    `${StatusCodes.OK} - Notification deleted successfully - ${method} ${path}`,
  );

  await redisRefreshCache(config.cache.notificationsSentKey);
  userNamespaceIo
    .to(notificationRoom)
    .emit(notificationEvent.deleted, { notificationId });
  return res
    .status(StatusCodes.OK)
    .json({ message: 'Notification deleted successfully.' });
};

const updateNotification = async (req: Request, res: Response) => {
  const {
    path,
    method,
    pathParams: { id: notificationId },
    user,
    body,
  } = adaptRequest(req);
  if (!notificationId || !mongoose.isValidObjectId(notificationId)) {
    throw new BadRequestError('Invalid notification id.');
  }

  const { error } = validateUpdateNotificationDto(body);
  if (error) {
    logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ data: { errors: formatValidationError(error) } });
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    body,
    { runValidators: true, new: true },
  );
  if (!notification) {
    throw new BadRequestError(
      'Notification update failed. Please confirm notification id is valid.',
    );
  }
  const logData = {
    action: `updateNotification: ${notificationId} - by ${user.role}`,
    resourceName: 'notifications',
    user: createObjectId(user.id),
    method,
    path,
  };
  await saveActivityLog(logData);
  logger.info(
    `${StatusCodes.OK} - Notification updated successfully - ${method} ${path}`,
  );

  userNamespaceIo
    .to(notificationRoom)
    .emit(notificationEvent.updated, { notification });
  return res.status(StatusCodes.OK).json({
    message: 'Notification updated successfully.',
    data: { notification },
  });
};

const prepareMissedNotification = async (
  notificationId: objectId,
  userId: objectId,
) => {
  notificationId = createObjectId(notificationId);
  const notification = await Notification.findById(notificationId);

  if (notification) {
    const notificationLog = await NotificationLog.findOne({
      notification: notificationId,
    });
    if (notificationLog && notificationLog.users.indexOf(userId) === -1) {
      notificationLog.users = notificationLog.users.concat(`,${userId}`);
      await notificationLog.save();
    }
  }

  return notification;
};

export {
  createNotification,
  getNotifications,
  deleteNotification,
  updateNotification,
  prepareMissedNotification,
};
