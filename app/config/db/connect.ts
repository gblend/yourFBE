import mongoose from 'mongoose';
import { logger } from '../../lib/utils';
import { CustomAPIError } from '../../lib/errors';
import { config } from '../config';
import { MongoMemoryServer } from 'mongodb-memory-server';

const { enabledEnv } = config.app;
const connectionStates: { 1: string; 2: string } = {
  1: 'connected',
  2: 'connecting',
};

export const connectDB = async (): Promise<void> => {
  const uri: string = config.database.uri;
  const message: { success: string; error: string } = {
    success: 'Database connection established.',
    error: 'Database connection error',
  };

  if (enabledEnv) {
    return await connect(uri, message);
  }

  return MongoMemoryServer.create().then((mongoDBServer: MongoMemoryServer) => {
    if (
      !Object.keys(connectionStates).includes(
        mongoose.connection.readyState.toString(),
      )
    ) {
      return connect(mongoDBServer.getUri(), message);
    }
  });
};

const connect = async (
  uri: string,
  message: { success: string; error: string },
): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    logger.info(message.success);
  } catch (err: any) {
    throw new CustomAPIError(`${message.error}: ${err.message}`);
  }
};
