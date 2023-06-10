import 'express-async-errors';
import {
	connectDB,
	logger,
	config,
	httpServer,
	initCron,
	appEnv,
	app,
} from './app';
import {constants} from './app/lib/utils';
const {port, baseUrl, name} = config.app;

const start =  async (): Promise<void> => {
	connectDB(config.database.uri).then(() => {
		if (!constants.envList.includes(appEnv)) return;
		httpServer.listen(port, () => {
			logger.info(`${name} server running: ${baseUrl}\n ${baseUrl}/api-docs`);
		});
		initCron();
	});
}

start().then((v: void) => v)

export default app;
