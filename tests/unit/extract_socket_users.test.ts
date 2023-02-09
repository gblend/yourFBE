import {extractSocketUsers} from '../../app/lib/utils';


describe('Handle', () => {
    const socketUsers: any[] = [
        {user: {name: 'testUser1', role: 'user', id: 'testId1'}},
        {user: {name: 'testUser2', role: 'user', id: 'testId2'}},
        {user: {name: 'testUser3', role: 'user', id: 'testId3'}},
    ];

    it('should return comma separated socket Ids when socket users are passed', async () => {
        const expectedSocketUsers = `${socketUsers[0].user.id},${socketUsers[1].user.id},${socketUsers[2].user.id}`
        const activeSocketIds = await extractSocketUsers(socketUsers);

        expect(activeSocketIds).toEqual(expectedSocketUsers);
    });

    it('should return empty when no socket user is passed', async () => {
        const expected = '';
        const activeSocketIds = await extractSocketUsers([]);

        expect(activeSocketIds).toEqual(expected);
    });
});
