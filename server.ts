import 'express-async-errors';
import {app, appEnv, config, connectDB, httpServer, initCron, logger,} from './app';
import {constants} from './app/lib/utils';

const {port, baseUrl, name} = config.app;

const start =  async (): Promise<void> => {
	connectDB(config.database.uri).then(() => {
		if (constants.envList.includes(appEnv)) {
			httpServer.listen(port, () => {
				logger.info(`${name} server running: ${baseUrl}\n ${baseUrl}/api-docs`);
			});
			initCron();
		}
	});
}

start().then((v: void) => v)

export default app;
