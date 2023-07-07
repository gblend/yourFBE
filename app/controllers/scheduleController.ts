import { Schedule } from '../models';
import { logger, redisGet, redisSet } from '../lib/utils';
import mongoose, { ClientSession } from 'mongoose';

export const logScheduledProcess = async (
  code: string = '',
  completed: boolean = false,
): Promise<boolean> => {
  const session: ClientSession = await mongoose.connection.startSession();
  const lockEntry: any = {
    scheduledLock: {
      scheduledCode: code,
      pseudoRandom: new mongoose.Types.ObjectId(),
    },
  };

  const processScheduled = JSON.parse(await redisGet(code));
  if (processScheduled === null) {
    await redisSet(code, false);
  } else if (processScheduled && !completed) {
    return true;
  }

  try {
    session.startTransaction({ maxCommitTimeMS: 1 });
    if (!completed) {
      const processInfo = await Schedule.findOneAndUpdate(
        { code },
        { $set: lockEntry },
        { upsert: false, new: false },
      );

      if (processInfo && processInfo.status === 'running') {
        await redisSet(code, true);
        return true;
      } else if (processInfo && processInfo.status === 'completed') {
        processInfo.status = 'running';
        processInfo.started_at = new Date(Date.now());
        processInfo.ended_at = undefined;
        await processInfo.save();
        await session.commitTransaction();
        await redisSet(code, false);
        logger.info(`Scheduled process updated to running: ${code}`);
        return false;
      } else if (!processInfo) {
        const data: any = {
          code,
          status: 'running',
          started_at: new Date(Date.now()),
          $set: lockEntry,
        };

        const processCreated = await Schedule.findOneAndUpdate({ code }, data, {
          upsert: true,
          new: true,
        });

        if (processCreated) {
          await session.commitTransaction();
          await redisSet(code, false);
          logger.info(`Scheduled process created: ${code}`);
        }
        return false;
      }
    } else if (completed) {
      const processCompleted = await Schedule.findOneAndUpdate(
        { code },
        {
          status: 'completed',
          ended_at: new Date(Date.now()),
          $set: lockEntry,
        },
        { new: true },
      );

      if (processCompleted) {
        await session.commitTransaction();
        await redisSet(code, false);
        logger.info(`Scheduled process updated to completed: ${code}`);
      }
      return false;
    }
  } catch (err: any) {
    logger.error(err.message);
    await session.abortTransaction();
    await redisSet(code, false);
  }
  await session.endSession();
  return false;
};
