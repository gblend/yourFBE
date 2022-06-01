const fs = require('fs');
const CustomError = require('../errors');
const {adaptRequest, logger, StatusCodes} = require('./index');
const {config} = require("../../config/config");
const cloudinary = require('cloudinary').v2;

const uploadImage = async (req, folder = 'file-upload/yourFeeds') => {
    const {files, method, path} = adaptRequest(req);
    if (!files) {
        throw new CustomError.BadRequestError('No file uploaded');
    }

    const _uploadImage = files.uploadImage;
    if (!uploadImage.mimetype.startsWith('image/')) {
        throw new CustomError.BadRequestError('Please provide a valid image');
    }

    if (_uploadImage.size > config.upload.maxSize) {
        throw new CustomError.BadRequestError('File exceeds maximum size of 1mb');
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
