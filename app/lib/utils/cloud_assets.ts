import { existsSync, mkdirSync, readFile, unlink, writeFile } from 'fs';
import path from 'path';
import { BadRequestError } from '../errors';
import { config } from '../../config/config';
import cloudinary from 'cloudinary';
import { logger } from './index';

const defaultFolder: string = 'avatar/yourFeeds';
type imageUrl = { url: string };

const uploadImage = async (
  files: any,
  uploadType: string = 'cloudinary',
  folder: string = '',
): Promise<{ url: string }> => {
  if (!files) {
    throw new BadRequestError('No file to be uploaded');
  }

  const uploadImageData = files.uploadImage;
  if (!uploadImageData.mimetype.startsWith('image/')) {
    throw new BadRequestError('Please provide a valid image');
  }

  if (uploadImageData.size > config.imageUpload.maxSize) {
    throw new BadRequestError('File exceeds maximum size of 2mb');
  }

  if (uploadType === 'cloudinary') {
    return uploadToCloudinary(uploadImageData, folder);
  }

  return uploadToLocal(uploadImageData);
};

const uploadToLocal = async (imageFile: any): Promise<imageUrl> => {
  const uploadDir = path.join(__dirname, '../../../public/uploads');
  const imgPath = `${uploadDir}/${imageFile.name}`;
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // move image to dist/public/uploads
  await imageFile.mv(imgPath).then(() => {
    readFile(imgPath, (err: Error | null, data: any) => {
      // copy image to public/uploads
      if (err)
        logger.warn(
          `Error occurred while copying local upload image: ${imageFile.name}`,
        );
      else {
        const _uploadDir: string = path.join(
          __dirname,
          '../../../../public/uploads',
        );
        const _path: string = `${_uploadDir}/${imageFile.name}`;
        writeFile(_path, data, (error: Error | null) => {
          if (!error) logger.info('Local upload image copied successfully');
        });
      }
    });
  });
  return { url: `/uploads/${imageFile.name}` };
};

const uploadToCloudinary = async (
  imageFile: any,
  folder: string = defaultFolder,
): Promise<imageUrl> => {
  if (folder === '' || folder === null) folder = defaultFolder;
  const { secure_url } = await cloudinary.v2.uploader.upload(
    imageFile.tempFilePath,
    {
      use_filename: true,
      folder,
    },
  );

  await unlinkFile(imageFile.tempFilePath);
  return { url: secure_url };
};

const unlinkFile = async (tempFilePath: string) => {
  unlink(tempFilePath, (err) => {
    if (err) logger.error(err.message);
    logger.info('temporary image file was deleted');
  });
};

export { uploadImage, uploadToLocal, uploadToCloudinary };
