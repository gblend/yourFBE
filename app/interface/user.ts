import {HydratedDocument, Model} from 'mongoose';

interface ITokenUser {
    name?: string,
    role: string,
    id?: string,
    _id?: string,
    firstname?: string,
    lastname?: string
}

interface IRefreshTokenUser {
    user?: ITokenUser,
    refreshToken: string,
}

interface IUpdatePassword {
    oldPassword: string,
    newPassword: string
}

interface IUser {
    firstname?: string,
    lastname?: string,
    email?: string | any,
    password?: string,
    passwordConfirmation?: string,
    role?: string,
    gender?: any,
    status?: string,
    socialChannel?: string,
    socialChannelId?: string,
    avatar?: string,
    verificationToken?: string,
    isVerified?: boolean | any,
    verified?: Date,
    lastLogin?: Date,
    passwordToken?: string,
    passwordTokenExpirationDate?: Date,
    _id?: any
}

// user instance methods
interface IUserMethods {
    createJWTToken(): string;
}

// user static methods
interface UserModel extends Model<IUser, {}, IUserMethods> {
    _createJWT(payload: { name: string, _id: string, role: string }):
        Promise<HydratedDocument<IUser, IUserMethods>>;
}

export {
    IUser,
    IRefreshTokenUser,
    ITokenUser,
    IUpdatePassword,
    UserModel,
    IUserMethods
}
