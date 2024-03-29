import {paginate} from '../../app/lib/utils';

describe('Paginator', () => {
    const data = ['cat', 'rat', 'dog', 'car', 'cab', 'data'];
    const expected: any = {pagination: {offset: 0, total: 0, pageNumber: 1, current: 1, previous: 1}, result: []};
    let params: any = {};

    afterEach(() => {
        params = {};
    });

    describe('Paginate Array Data', () => {
        describe('paginate without data', () => {
            it('without pageNumber, pageSize, and empty array', async () => {
                expected.pagination.pageSize = 10;
                expected.pagination.pages = 0;
                expected.pagination.next = 1;

                expect(await paginate([], {})).toEqual(expected);
            });

            it('with pageNumber and empty array', async () => {
                params.pageNumber = 1;
                expected.pagination.pageSize = 10;
                expected.pagination.pages = 0;
                expected.pagination.next = 1;

                expect(await paginate([], params)).toEqual(expected);
            });

            it('with pageSize and empty array', async () => {
                params.pageSize = 1;
                expected.pagination.pageSize = 1;
                expected.pagination.pages = 0;
                expected.pagination.next = 1;

                expect(await paginate([], params)).toEqual(expected);
            });
        });

        describe('paginate with data', () => {
            it('with pageNumber, pageSize, and data array', async () => {
                params.pageSize = 5;
                params.pageNumber = 1;
                expected.pagination.pageSize = 5;
                expected.pagination.total = 6;
                expected.pagination.pages = 2;
                expected.pagination.next = 2;
                expected.result = data.slice(0, 5)

                expect(await paginate(data, params)).toEqual(expected);
            });

            it('with pageNumber and data array', async () => {
                params.pageNumber = 1;
                expected.pagination.pageSize = 10;
                expected.pagination.total = 6;
                expected.pagination.pages = 1;
                expected.pagination.next = 1;
                expected.result = data.slice(0, 10)

                expect(await paginate(data, params)).toEqual(expected);
            });

            it('with pageSize and data array', async () => {
                params.pageSize = 5;
                expected.pagination.pageSize = 5;
                expected.pagination.total = 6;
                expected.pagination.pages = 2;
                expected.pagination.next = 2;
                expected.result = data.slice(0, 5)

                expect(await paginate(data, params)).toEqual(expected);
            });
        });
    });
});
