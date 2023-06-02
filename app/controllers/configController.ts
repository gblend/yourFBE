import {StatusCodes} from 'http-status-codes';
import {ConfigData, validateConfigDataDto} from '../models';
import {BadRequestError, NotFoundError} from '../lib/errors';
import {adaptRequest, constants, createObjectId, formatValidationError, logger, paginate} from '../lib/utils';
import {saveActivityLog} from '../lib/dbActivityLog';
import {Request, Response} from '../types/index';
import {ConfigModel, IResponse} from '../interface';

const createConfig = async (req: Request, res: Response): Promise<Response<IResponse>> => {
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

const getAllConfig = async (req: Request, res: Response) => {
    const {path, method, queryParams: {pageSize, pageNumber}} = adaptRequest(req);
    const configData: ConfigModel[] = await ConfigData.find({});
    if (!configData.length) {
        logger.info(`${StatusCodes.NOT_FOUND} - No config data found for get_all_config - ${method} ${path}`);
        throw new NotFoundError('No config data found.');
    }
    const {pagination, result} = await paginate(configData, {pageSize, pageNumber});
    return res.status(StatusCodes.OK).json({
        message: 'Config data fetched successfully',
        data: {config: result, pagination},
    });
}

const getSingleConfig = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: configId}, path, method} = adaptRequest(req);
    const config = await ConfigData.findOne({_id: configId});
    if (!config) {
        logger.info(`${StatusCodes.NOT_FOUND} - Config with id ${configId} not found for get_single_config - ${method} ${path}`);
        throw new BadRequestError(`Config not found.`);
    }
    return res.status(StatusCodes.OK).json({
        message: `Config fetched successfully.`,
        data: {config},
    });
}

const getConfigByPath = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {queryParams: {reference: configPath}, path, method} = adaptRequest(req);
    const config = await ConfigData.findOne({path: configPath});
    if (!config) {
        logger.info(`${StatusCodes.NOT_FOUND} - Config with path ${configPath} not found for get_config_by_path - ${method} ${path}`);
        throw new BadRequestError(`Config not found for provided path`);
    }
    return res.status(StatusCodes.OK).json({
        message: `Config fetched successfully.`,
        data: {config},
    });
}

const updateConfig = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: configId}, body, user: {id: userId, role}, method, path} = adaptRequest(req);
    const config = await ConfigData.findOneAndUpdate({_id: configId}, body, {new: true, runValidators: true});
    const logData = {
        action: `updateConfig: ${configId} - by ${role}`,
        resourceName: 'ConfigData',
        user: createObjectId(userId),
        path,
        method,
    }
    await saveActivityLog(logData);
    return res.status(StatusCodes.OK).json({message: 'Config updated successfully.', data: {config}});
}

const disableConfig = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: configId}, method, path, user: {id: userId, role}} = adaptRequest(req);
    await ConfigData.findOneAndUpdate({_id: configId}, {status: constants.STATUS_DISABLED}, {
        new: true,
        runValidators: true
    });

    const logData = {
        action: `disableConfig: ${configId} - by ${role}`,
        resourceName: 'ConfigData',
        user: createObjectId(userId),
        path,
        method
    }
    await saveActivityLog(logData);
    return res.status(StatusCodes.OK).json({
        message: `Config disabled successfully.`,
    });
}

const deleteConfig = async (req: Request, res: Response): Promise<Response<IResponse>> => {
    const {pathParams: {id: configId}, method, path, user: {id: userId, role}} = adaptRequest(req);
    const config = await ConfigData.findOne({_id: configId});
    if (!config) {
        logger.info(`${StatusCodes.NOT_FOUND} Config with id ${configId} not found for delete_config - ${method} ${path}`);
        throw new BadRequestError(`Config not found.`);
    }
    await config.remove();

    const logData = {
        action: `deleteConfig: ${configId} - by ${role}`,
        resourceName: 'ConfigData',
        user: createObjectId(userId),
        path,
        method
    }
    await saveActivityLog(logData);
    return res.status(StatusCodes.OK).json({
        message: `Config deleted successfully.`,
    });
}

export {
    getAllConfig,
    createConfig,
    getSingleConfig,
    updateConfig,
    disableConfig,
    deleteConfig,
    getConfigByPath
}
