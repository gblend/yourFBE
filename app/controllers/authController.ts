import {ObjectId} from 'mongoose';
import {config} from '../config/config';
import {saveActivityLog} from '../lib/dbActivityLog';
import {pushToQueue} from '../lib/utils/amqplib';
import {
    adaptRequest,
    attachCookiesToResponse,
    constants,
    createObjectId,
    encrypt,
    formatValidationError,
    generateToken,
    logger,
    redisRefreshCache
} from '../lib/utils';
import {Token, User, validateLogin, validateUserDto} from '../models';
import {userNamespaceIo} from '../socket';
import {StatusCodes} from 'http-status-codes';
import {Request, Response} from '../types/index';
import {registerSocialProfile} from '../socialauth';
import {BadRequestError, CustomAPIError, UnauthenticatedError} from '../lib/errors';
import {ITokenUser} from '../interface';

let queueName: string = '';
let queueErrorMsg: string = '';

const register = async (req: Request, res: Response): Promise<Response> => {
    const {body, ip, headers} = adaptRequest(req);
    const {email, firstname, lastname, password} = body;
    const {error} = validateUserDto(body);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {errors: formatValidationError(error)}
        });
    }

    const isEmailExist = await User.findOne({email});
    if (isEmailExist) {
        throw new CustomAPIError(constants.auth.ALREADY_IN_USE('This email address'));
    }

    const isAdminExists: boolean = (await User.countDocuments({role: 'admin'})) === 0;
    const role: string = isAdminExists ? 'admin' : 'user';
    const isVerified: boolean = isAdminExists;

    const verificationToken: string = generateToken();
    const user: any = await User.create({email, firstname, lastname, password, role, verificationToken, isVerified});
    (role === 'admin') ? await redisRefreshCache(config.cache.adminsKey) : await redisRefreshCache(config.cache.usersKey);
    const accessTokenJWT = await user.createJWT();
    // send account verification email via queue
    queueErrorMsg = 'Unable to queue verify email, please try again';
    queueName = config.amqp.verifyEmailQueue;
    await pushToQueue(queueName, queueErrorMsg, {
        name: user.firstname,
        email: user.email,
        verificationToken: user.verificationToken
    }).catch(err => logger.error(`Queue error: ${err.message}`));
    user.password = undefined;

    const tokenInfo = await saveTokenInfo(user, {ip, headers});
    const refreshTokenJWT: string = await user.createRefreshJWT(user, tokenInfo.refreshToken);
    attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});

    userNamespaceIo.to(config.socket.group.users).volatile.emit(config.socket.events.admin.userRegistered, {user});
    return res.status(StatusCodes.OK).json({
        message: 'Please check your email for a link to verify your account',
        data: {
            token: accessTokenJWT,
            refreshToken: refreshTokenJWT,
            user,
        }
    });
}

const login = async (req: Request, res: Response) => {
    const {body, headers, ip} = adaptRequest(req);
    let verificationMsg: string = '';
    const {error} = validateLogin(body);
    if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            data: {
                errors: formatValidationError(error)
            }
        });
    }

    const {email, password} = body;
    const user: any = await User.findOne({email}).select('-verificationToken');
    if (!user) {
        throw new BadRequestError(constants.auth.INVALID_CREDENTIALS());
    }

    if (user.socialChannelId && !user.password) {
        throw new BadRequestError('This account can only be accessed via social login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new BadRequestError('Invalid email or password.');
    }

    if (user.status === constants.STATUS_DISABLED) {
        throw new UnauthenticatedError('Account is deactivated. Please contact support.');
    }

    if (!user.isVerified) {
        verificationMsg = 'Please verify your email to get full access to your account capabilities.';
    } else verificationMsg = 'Verified';

    const accessTokenJWT = await user.createJWT();
    user.lastLogin = new Date(Date.now());
    await user.save();
    const tokenInfo = await saveTokenInfo(user, {ip, headers});
    const refreshTokenJWT = await user.createRefreshJWT(user, tokenInfo.refreshToken);

    attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});
    user.password = undefined;
    return res.json({
        data: {
            token: accessTokenJWT,
            refreshToken: refreshTokenJWT,
            verificationMsg,
            user,
        },
        message: constants.auth.SUCCESSFUL('Login'),
    });
}

const socialLoginError = async (_: Request, res: Response): Promise<Response<{}>> => {
    return res.status(StatusCodes.BAD_REQUEST).json({});
}

const socialLogin = async (req: Request, res: Response) => {
    const {headers, ip, socialProfile, body: {profileData, updateProfile = false}} = adaptRequest(req);
    let user: any;

    if (updateProfile) {
        if (!profileData || !Object.keys(profileData).length || !profileData.email) {
            throw new CustomAPIError('Invalid social login parameters.');
        }

        user = await registerSocialProfile(profileData, (_: any, __: any) => { /*unused */
        });
    } else user = socialProfile;

    if (!user || !Object.keys(user).length) {
        throw new CustomAPIError('Invalid social login parameters.');
    }

    if (user.status === constants.STATUS_DISABLED) {
        throw new UnauthenticatedError('Account is disabled. Please contact support.');
    }

    const accessTokenJWT = await user.createJWT();
    const tokenInfo = await saveTokenInfo(user, {ip, headers});
    const refreshTokenJWT = await user.createRefreshJWT(user, tokenInfo.refreshToken);

    attachCookiesToResponse({accessTokenJWT, refreshTokenJWT, res});
    return res.json({
        data: {
            token: accessTokenJWT,
            refreshToken: refreshTokenJWT,
            user
        },
        message: constants.auth.SUCCESSFUL('Login'),
    });
}

const logout = async (req: Request, res: Response): Promise<void> => {
    const {user, signedCookies}: { user: ITokenUser | any, signedCookies: any } = adaptRequest(req);
    await Token.findOneAndDelete({user: user.id});

    signedCookies.accessToken = undefined;
    signedCookies.refreshToken = undefined;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(StatusCodes.NO_CONTENT).json({});
}

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const {body: {email}} = adaptRequest(req);
    if (!email) {
        throw new BadRequestError('Please enter a valid email');
    }

    const user = await User.findOne({email});
    if (user) {
        const passwordToken: string = generateToken();

        // queue reset password email
        queueErrorMsg = 'Unable to queue reset password email, please try again';
        queueName = config.amqp.resetEmailQueue;
        await pushToQueue(queueName, queueErrorMsg, {name: user.firstname, email: user.email, passwordToken});

        const passwordTokenExpirationDate: Date = new Date(Date.now() + config.minutes.ten);
        user.passwordToken = encrypt(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
    }
    res.status(StatusCodes.OK).json({message: 'Please check your email for password reset link.'});
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const {body: {email, token, password}, method, path} = adaptRequest(req);
    if (!email || !token || !password) {
        throw new BadRequestError('Please provide all values - email, token, password');
    }

    const user = await User.findOne({email});
    if (!user) {
        throw new BadRequestError('Account not found.');
    }

    if (user.passwordToken !== encrypt(token)) {
        throw new BadRequestError('Invalid password reset token');
    }

    const currentDate: Date = new Date();
    if (user.passwordTokenExpirationDate! < currentDate) {
        throw new BadRequestError('Password reset link has expired');
    }

    user.passwordTokenExpirationDate = new Date(Date.now() - config.minutes.ten);
    user.passwordToken = '';
    user.password = password;
    await user.save();

    const logData = {
        action: `resetPassword - by ${user.role}`,
        resourceName: 'users',
        user: user?.id,
        method,
        path,
    }
    await saveActivityLog(logData);
    res.status(StatusCodes.OK).json({
        message: 'Password changed successfully.'
    });
}

const verifyEmail = async (req: Request, res: Response) => {
    const {body: {email, token}} = adaptRequest(req);
    const user = await User.findOne({email});
    if (!user) {
        throw new UnauthenticatedError('Account verification failed, account not found');
    }
    if (user.verificationToken !== token) {
        throw new UnauthenticatedError('Account verification failed, invalid token');
    }

    user.isVerified = true;
    user.verificationToken = '';
    user.verified = new Date(Date.now());
    user.save();
    res.status(StatusCodes.OK).json({message: 'Account successfully verified'});
}

const saveTokenInfo = async ({_id: userId}: { _id?: ObjectId }, {ip, headers}: { ip: string, headers: any }) => {
    const isTokenExist = await Token.findOne({user: userId});
    if (isTokenExist) {
        if (!isTokenExist.isValid) {
            throw new UnauthenticatedError(constants.auth.INVALID_CREDENTIALS());
        }
        return isTokenExist;
    }
    const refreshToken = generateToken();
    const userAgent = headers['user-agent'] || 'unknown';
    const userToken = {refreshToken, ip, userAgent, user: userId};
    return Token.create(userToken);
}

const resendVerificationEmail = async (req: Request, res: Response) => {
    const {user, body} = adaptRequest(req);
    const filter: any = {};

    if (user?.id) {
        filter._id = createObjectId(user?.id);
    } else if (body?.email) {
        filter.email = body.email;
    }

    const userAccount = await User.findOne(filter);
    if (!userAccount) {
        throw new BadRequestError('Account not found.');
    }

    userAccount.verificationToken = generateToken();
    await userAccount.save();
    // resend account verification email via queue
    queueErrorMsg = 'Unable to queue verify email, please try again';
    queueName = config.amqp.verifyEmailQueue;
    await pushToQueue(queueName, queueErrorMsg, {
        name: userAccount.firstname,
        email: userAccount.email,
        verificationToken: userAccount.verificationToken
    }).catch(err => logger.error(`Queue error: ${err.message}`));

    return res.status(StatusCodes.OK).json({
        message: 'Please check your email for a link to verify your account',
    });
}

export {
    register,
    logout,
    login,
    resetPassword,
    forgotPassword,
    resendVerificationEmail,
    socialLogin,
    socialLoginError,
    verifyEmail
}
