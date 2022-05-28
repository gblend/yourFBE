'use strict';

const {paginate} = require('lib/utils');

// supertest
// sinon
// nock
// nock

describe('Paginator', () => {
    it('with out pageNumber, data and pageSize', () => {
        const result = [];
        expect(paginate({}, result)).toEqual(result);
    })
});
