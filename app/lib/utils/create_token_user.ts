import {ITokenUser} from '../../interface';

export const createTokenUser = (user: ITokenUser): ITokenUser => {
    if (user) {
        return {name: user.name, id: user._id, role: user.role};
    }
    return user;
}

