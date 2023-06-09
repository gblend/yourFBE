import changePassword from './change_password';
import profileDetails from './details';
import userData from './me';
import disableAccount from './disable_account';
import updateAccount from './update_account';
import uploadProfileImage from './upload_image';

export default {
    ...changePassword,
    ...profileDetails,
    ...disableAccount,
    ...updateAccount,
    ...userData,
    ...uploadProfileImage,
}