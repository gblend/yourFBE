import {ITokenUser} from '../../interface';

const createTokenUser = (user: ITokenUser): ITokenUser => {
    if (user) {
        return { name: user.name, id: user._id, role: user.role };
    }
    return user;
}

export {
    createTokenUser
}
