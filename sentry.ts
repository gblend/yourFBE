import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import {app} from './app/socket';
import * as http from 'http';
import {config} from './app/config/config';
const appEnv = config.app.env;

Sentry.init({
    dsn: 'https://1f76754fe8e7488eaa88f24aa0a380e9@o4505244380495872.ingest.sentry.io/4505244392554496',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({tracing: true}),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({app}),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
        new Sentry.Integrations.Mongo({
            useMongoose: true
        }),
        new ProfilingIntegration(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
    profilesSampleRate: 0.5,
    debug: appEnv === 'development',
    environment: appEnv,
    beforeSend(event) {
        // Modify or drop the event here
        if (event.user) {
            // Don't send user's name
            delete event.user.name;
        }
        return event;
    },
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
const sentryRequestHandler = Sentry.Handlers.requestHandler({user: ['id']});
// TracingHandler creates a trace for every incoming request
const sentryTracingHandler = Sentry.Handlers.tracingHandler();

// The error handler must be before any other error middleware and after all controllers
export default (_error: any, _req: http.IncomingMessage, _res: http.ServerResponse, _next: any) => {
    Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
            // Capture all 404 and 500 errors
            return error.status === 404 || error.status === 500;
        },
    });
}

export {
    sentryRequestHandler,
    sentryTracingHandler,
}