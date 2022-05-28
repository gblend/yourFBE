'use strict';

const {paginate} = require('../../lib/utils');

// supertest
// sinon
// nock
// nock

describe('Paginator', () => {
    let data = [];
    let expected = {};
    let params = {};

    beforeEach(() => {
        expected = { pagination: { pageSize: 10, pageNumber: 1, offset: 0 }, result: [] }
    });

    describe('without data', () => {
        it('without pageNumber, pageSize, and empty array', () => {

            expect(paginate(data, {})).toEqual(expected);
        });

        it('with pageNumber and empty array', () => {
            params.pageNumber = 1;

            expect(paginate(data, params)).toEqual(expected);
        });

        it('with pageSize and empty array', () => {
            params.pageSize = 1;
            expected.pagination.pageSize = 1;

            expect(paginate(data, params)).toEqual(expected);
        });
    });
});
