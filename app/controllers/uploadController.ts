import {User} from '../models/User';
import {StatusCodes} from 'http-status-codes';
import NotFoundError from '../lib/errors/not_found';
import {Request, Response} from '../types';
import {BadRequestError} from '../lib/errors';
import {
    adaptRequest,
    createObjectId,
    logger,
} from '../lib/utils';
import {uploadImage} from '../lib/utils/image_upload';


const uploadProfileImage = async (req: Request, res: Response): Promise<any> => {
    const {files, body: {uploadType = 'cloudinary', folder = ''}, user, path, method} = adaptRequest(req);
    if (!user) {
        logger.info('Invalid user identifier');
        throw new BadRequestError('Invalid user identifier');
    }

    const {url} = await uploadImage(files, uploadType, folder);
    const {avatar}: any = await User.findOneAndUpdate({_id: createObjectId(user.id)},
        {avatar: url}, {new: true, runValidators: true});

    if (!avatar) {
        logger.info(JSON.stringify(`${StatusCodes.NOT_FOUND} - Account not found for upload_profile_image - ${method} ${path}`));
        throw new NotFoundError(`Account not found for profile image upload action`);
    }

    logger.info(`${StatusCodes.OK} - Profile image upload successful - ${method} ${path}`);
    return res.status(StatusCodes.OK).json({
        message: 'Profile image uploaded successfully',
        data: {imageUrl: avatar, }
    });
}


export {
    uploadProfileImage,
}
