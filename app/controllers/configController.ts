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

const getSingleConfig = async (req, res) => {
    const {pathParams: {id: configId}, path, method} = adaptRequest(req);
    const config = await ConfigData.findOne({_id: configId});
    if (!config) {
        logger.info(`${StatusCodes.NOT_FOUND} - Config with id ${configId} not found for get_single_config - ${method} ${path}`);
        throw new CustomError.BadRequestError(`Config not found.`);
    }
    return res.status(StatusCodes.OK).json({
        message: `Config fetched successfully.`,
        data: {config},
    });
}

const getConfigByPath = async (req, res) => {
    const {queryParams: {value: configPath}, path, method} = adaptRequest(req);
    const config = await ConfigData.findOne({path: configPath});
    if (!config) {
        logger.info(`${StatusCodes.NOT_FOUND} - Config with path ${configPath} not found for get_config_by_path - ${method} ${path}`);
        throw new CustomError.BadRequestError(`Config not found by path: ${configPath}`);
    }
    return res.status(StatusCodes.OK).json({
        message: `Config fetched successfully.`,
        data: {config},
    });
}

const updateConfig = async (req, res) => {
    const {pathParams: {id: configId}, body, user: {id: userId, role}, method, path} = adaptRequest(req);
    const config = await ConfigData.findOneAndUpdate({_id: configId}, body, {new: true, runValidators: true});
    const logData = {
        action: `updateConfig: ${configId} - by ${role}`,
        resourceName: 'ConfigData',
        user: createObjectId(userId),
    }
    await saveActivityLog(logData, method, path);
    return res.status(StatusCodes.OK).json({message: 'Config updated successfully.', data: {config}});
}

const disableConfig = async (req, res) => {
    const {pathParams: {id: configId}, method, path, user: {id: userId, role}} = adaptRequest(req);
    await ConfigData.findOneAndUpdate({_id: configId}, {status: 'disabled'}, {
        new: true,
        runValidators: true
    });

    const logData = {
        action: `disableConfig: ${configId} - by ${role}`,
        resourceName: 'ConfigData',
        user: createObjectId(userId),
    }
    await saveActivityLog(logData, method, path);
    return res.status(StatusCodes.OK).json({
        message: `Config disabled successfully.`,
    });
}

const deleteConfig = async (req, res) => {
    const {pathParams: {id: configId}, method, path, user: {id: userId, role}} = adaptRequest(req);
    const config = await ConfigData.findOne({_id: configId});
    if (!config) {
        logger.info(`${StatusCodes.NOT_FOUND} Config with id ${configId} not found for delete_config - ${method} ${path}`);
        throw new CustomError.BadRequestError(`Config with id ${configId} not found.`);
    }
    await config.remove();

    const logData = {
        action: `deleteConfig: ${configId} - by ${role}`,
        resourceName: 'ConfigData',
        user: createObjectId(userId),
    }
    await saveActivityLog(logData, method, path);
    return res.status(StatusCodes.OK).json({
        message: `Config deleted successfully.`,
    });
}

module.exports = {
    getAllConfig,
    createConfig,
    getSingleConfig,
    updateConfig,
    disableConfig,
    deleteConfig,
    getConfigByPath
}
