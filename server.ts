import 'express-async-errors';
import { config, connectDB, httpServer, initCron, logger } from './app';
const { port, baseUrl, name, enabledEnv } = config.app;

const start = (): void => {
  connectDB()
    .then((): void => {
      if (enabledEnv) {
        httpServer.listen(port, (): void => {
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
