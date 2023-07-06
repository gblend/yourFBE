import 'express-async-errors';
import { appEnv, config, connectDB, httpServer, initCron, logger } from './app';
import { constants } from './app/lib/utils';

const { port, baseUrl, name } = config.app;

const start = (): void => {
  connectDB()
    .then(() => {
      if (constants.envList.includes(appEnv)) {
        httpServer.listen(port, () => {
          logger.info(
            `${name} server running: ${baseUrl}\n ${baseUrl}/api-docs`,
          );
        });
        initCron();
      }
    })
    .catch((err: Error) => logger.error(err.message));
};
start();

export default httpServer;
