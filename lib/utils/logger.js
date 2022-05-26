const winston = require('winston');

const logger = () => {
    const _logger = winston.createLogger({
        format: winston.format.json(),
        defaultMeta: { service: 'yourFeeds-backend' },
        transports: [
            new winston.transports.File({
                level: 'warn',
                filename: '../../logs/app.log',
                format: winston.format.combine(
                    winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                    winston.format.align(),
                    winston.format.colorize({colors: { warn: 'yellow' }} ),
                    winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
                )
            }),
            new winston.transports.File({
                level: 'error',
                filename: '../../logs/errors.log',
                format: winston.format.combine(
                    winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                    winston.format.align(),
                    winston.format.colorize({colors: { error: 'red' }} ),
                    winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
                )
            })
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        _logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                winston.format.align(),
                winston.format.colorize({colors: { info: 'blue'}} ),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }));
    }

    return _logger;
}

module.exports = { logger: logger()}
