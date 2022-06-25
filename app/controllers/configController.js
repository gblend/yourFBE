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

const getAllConfig = async (req, res) => {
    const {path, method} = adaptRequest(req);
    let configData = await ConfigData.find({});
    if (configData.length < 1) {
        logger.info(`${StatusCodes.NOT_FOUND} - No config data found for get_all_config - ${method} ${path}`);
        throw new CustomError.NotFoundError('No config data found.');
    }
    return res.status(StatusCodes.OK).json({
        message: 'Config data fetched successfully',
        data: {configData},
    });
}

module.exports = {
    getAllConfig,
    createConfig,
}
