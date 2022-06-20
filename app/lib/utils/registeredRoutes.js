'use strict';

module.exports.appRoutes = (app) => {
	let routes = [];

	app._router.stack.forEach((routerSTack) => {
		if (routerSTack.route) { // app routes
			const path = routerSTack.route.path;
			const method = Object.keys(routerSTack.route.methods)[0].toUpperCase().padEnd(36);

			routes.push(`${method} ${path}`);
		} else if (routerSTack.name === 'router') { // router middleware
			routerSTack.handle.stack.forEach((handler) => {
				const path = handler.route.path;
				const routeMiddlewares = ['authenticateUser', '<anonymous>'];
				handler.route.stack.forEach((stack) => {
					if (!routeMiddlewares.includes((stack.name))) {
						const method = stack.method.toUpperCase().padEnd(7);
						const name = stack.name;

						routes.push(`${name.padEnd(28)} ${method} ${path}`);
					}
				});
			});
		}
	});

	return routes;
}
