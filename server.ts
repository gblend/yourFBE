import 'express-async-errors';
import { config, connectDB, httpServer, initCron, logger } from './app';
const { port, baseUrl, name, enabledEnv } = config.app;

const start = (): void => {
  connectDB()
    .then(() => {
      if (enabledEnv) {
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
