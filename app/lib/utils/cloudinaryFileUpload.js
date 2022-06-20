'use strict';

const fs = require('fs');
const CustomError = require('../errors');
const {adaptRequest, logger, StatusCodes} = require('./index');
const {config} = require('../../config/config');
const cloudinary = require('cloudinary').v2;
const defaultFolder = 'file-upload/yourFeeds';

const uploadImage = async (req, folder = defaultFolder) => {
    const {files, method, path} = adaptRequest(req);
    if (folder === '' || folder === null) folder = defaultFolder;

    if (!files) {
        throw new CustomError.BadRequestError('No file uploaded');
    }

    const _uploadImage = files.uploadImage;
    if (!_uploadImage.mimetype.startsWith('image/')) {
        throw new CustomError.BadRequestError('Please provide a valid image');
    }

    if (_uploadImage.size > config.imageUpload.maxSize) {
        throw new CustomError.BadRequestError('File exceeds maximum size of 2mb');
    }

    const result = await cloudinary.uploader.upload(_uploadImage.tempFilePath, {
        use_filename: true,
        folder: folder
    })
    fs.unlinkSync(_uploadImage.tempFilePath);
    logger.info(`${StatusCodes.OK} - file uploaded successfully - ${method} ${path}`)

    return result;
}

module.exports = {uploadImage}
