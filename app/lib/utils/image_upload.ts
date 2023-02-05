import fs from 'fs';
const path = require("path");
import {BadRequestError} from '../errors';
import {config} from '../../config/config';
import cloudinary from 'cloudinary';
const defaultFolder: string = 'avatar/yourFeeds';
type imageUrl = { url: string };

const uploadImage = async (files: any, uploadType: string = 'cloudinary', folder: string = ''): Promise<any> => {
    if (!files) {
        throw new BadRequestError('No file uploaded');
    }

    const uploadImage = files.uploadImage;
    if (!uploadImage.mimetype.startsWith('image/')) {
        throw new BadRequestError('Please provide a valid image');
    }

    if (uploadImage.size > config.imageUpload.maxSize) {
        throw new BadRequestError('File exceeds maximum size of 2mb');
    }

    if (uploadType === 'cloudinary') {
        return uploadToCloudinary(uploadImage, folder)
    }

    return uploadToLocal(uploadImage);
}

const uploadToLocal = async (imageFile: any): Promise<imageUrl> => {
    const imgPath = path.join(__dirname, '../public/uploads/'+`${imageFile.name}`)
    await imageFile.mv(imgPath)

    return {url: `/uploads/${imageFile.name}`};
}

const uploadToCloudinary = async (imageFile: any, folder: string = defaultFolder): Promise<imageUrl> => {
    if (folder === '' || folder === null) folder = defaultFolder;
    const {secure_url} = await cloudinary.v2.uploader.upload(imageFile.tempFilePath, {
        use_filename: true,
        folder: folder
    })
    fs.unlinkSync(imageFile.tempFilePath);

    return {url: secure_url};
}

export {
    uploadImage
}


