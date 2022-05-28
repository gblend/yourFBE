const fs = require("fs");
const CustomError = require("../errors");
const cloudinary = require('cloudinary').v2;

const uploadImage = async (req) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('No file uploaded');
    }

    const _uploadImage = req.files.uploadImage;
    if (!uploadImage.mimetype.startsWith('image/')) {
        throw new CustomError.BadRequestError('Please provide a valid image');
    }

    const maxSize = 1024 * 1024;
    if (_uploadImage.size > maxSize) {
        throw new CustomError.BadRequestError('File exceeds maximum size of 1mb');
    }

    const result = await cloudinary.uploader.upload(_uploadImage.tempFilePath, {
        use_filename: true,
        folder: 'file-upload'
    })
    fs.unlinkSync(_uploadImage.tempFilePath);
    return result;
}

module.exports = {uploadImage}
