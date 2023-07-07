import { logger } from '../lib/utils';
import mongoose from 'mongoose';

export const eventHandler = (event: string) => {
  return (err: any) => {
    switch (event) {
      case 'SIGTERM':
      case 'uncaughtException':
        logger.error(`${event} - closing http server: ${err?.message}`);
        if (mongoose.connection.readyState === 1) {
          mongoose.connection.close(false).then(process.exit(err ? 1 : 0));
        } else process.exit(err ? 1 : 0);
        break;
      case 'unhandledRejection':
      default:
        logger.error(`${event} - ${err?.message}`);
    }
  };
};
