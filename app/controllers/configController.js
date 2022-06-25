'use strict';

const {StatusCodes} = require('http-status-codes');
const {ConfigData, validateConfigDataDto} = require('../models/Config');
const CustomError = require('../lib/errors');
const {adaptRequest, formatValidationError, logger, createObjectId} = require('../lib/utils');
const {saveActivityLog} = require('../lib/dbActivityLog');

const createConfig = async (req, res) => {
    const {body} = adaptRequest(req);
    const {error} = validateConfigDataDto(body);
    if (error) {
        logger.info(JSON.stringify(JSON.stringify(formatValidationError(error))));
        return res.status(StatusCodes.BAD_REQUEST)
            .json({data: {errors: formatValidationError(error)}});
    }
    const config = await ConfigData.create(body);
    return res.status(StatusCodes.CREATED)
        .json({message: 'Config created successfully.', data: {config}});
}


module.exports = {
    createConfig,
}
