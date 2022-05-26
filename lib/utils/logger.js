const winston = require('winston');

const logger = () => {
    const _logger = winston.createLogger({
        format: winston.format.json(),
        defaultMeta: { service: 'yourFeeds-backend' },
        transports: [
            new winston.transports.File({filename: '../../logs/app.log'}),
            new winston.transports.File({filename: '../../logs/errors.log'})
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        _logger.add(new winston.transports.Console({
            format: winston.format.simple(),
        }));
    }

    return _logger;
}

module.exports = { logger: logger()}
