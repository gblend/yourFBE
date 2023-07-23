import mongoose from 'mongoose';
import { pubClient, subClient } from '../../app/socket';

const tearDownTestConnection = async (): Promise<void> => {
  await mongoose.disconnect();
  if (pubClient) pubClient.disconnect();
  if (subClient) subClient.disconnect();
};

export { tearDownTestConnection };
