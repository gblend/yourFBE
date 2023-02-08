import {createTokenUser} from '../../app/lib/utils';

describe('CreateTokenUser', () => {

    it('should return user object for token creation', () => {
        const user = { name: 'Test User', _id: '1234', role: 'user' };

        expect(createTokenUser(user)).toMatchObject({
            name: user.name,
            id: user._id,
            role: user.role
        });
    });
});
