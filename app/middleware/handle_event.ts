import {logger} from '../lib/utils/logger';
import mongoose from 'mongoose';

const handle = (event: string) => {
	return (err: any) => {
		switch (event) {
			case 'SIGTERM':
				logger.error(`${event} signal received - closing http server.`);
				if (mongoose.connection.readyState === 1) {
					mongoose.connection.close(false, () => {
						process.exit(err? 1 : 0);
					});
				}
				break;
			case 'uncaughtException':
				logger.error(`${event} - ${err.stack}`);
				process.exit(1);
				break;
			default:
				logger.warn(`${event} - ${err.message}`);
		}
	}
}

export {
	handle
}
