'use strict';

const {StatusCodes} = require('http-status-codes');

const notFound = (_, res) => res.status(StatusCodes.NOT_FOUND).json({
    'status': StatusCodes.NOT_FOUND,
    message: 'Route does not exist.'
})

module.exports = notFound
