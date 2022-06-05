const { createTokenUser } = require('../../lib/utils');

describe('CreateTokenUser', () => {
    it('should return null when input is null', () => {
        const user = null;
        expect(createTokenUser(user)).toBe(user);
    });

    it('should return undefined when input is undefined', () => {
        const user = undefined;
        expect(createTokenUser(user)).toBe(user);
    });

    it('should return user object with undefined values when input is empty object', () => {
        const user = {};
        expect(createTokenUser(user)).toMatchObject({
            name: undefined,
            id: undefined,
            role: undefined
        });
    });

    it('should return user object for token creation', () => {
        const user = { name: 'Test User', _id: '1234', role: 'user' };

        expect(createTokenUser(user)).toMatchObject({
            name: user.name,
            id: user._id,
            role: user.role
        });
    });
});