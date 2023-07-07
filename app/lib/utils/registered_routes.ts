import { Application } from '../../types/index';

export const appRoutes = (app: Application): string[] => {
  const routes: string[] = [];

  app._router.stack.forEach((routerSTack: any) => {
    if (routerSTack.route) {
      // app routes
      const path = routerSTack.route.path;
      const method = Object.keys(routerSTack.route.methods)[0]
        .toUpperCase()
        .padEnd(36);

      routes.push(`${method} ${path}`);
    } else if (routerSTack.name === 'router') {
      // router middleware
      routerSTack.handle.stack.forEach((handler: any) => {
        const path =
          handler.route && handler.route.path ? handler.route.path : '';
        const routeMiddlewares = ['authenticateUser', '<anonymous>'];

        if (handler.route && handler.route.stack) {
          handler.route.stack.forEach((stack: any) => {
            if (!routeMiddlewares.includes(stack.name)) {
              const method = stack.method.toUpperCase().padEnd(7);
              const name = stack.name;

              routes.push(`${name.padEnd(28)} ${method} ${path}`);
            }
          });
        }
      });
    }
  });

  return routes;
};
