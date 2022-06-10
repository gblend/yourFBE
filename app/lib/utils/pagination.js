'use strict';

const {logger} = require('./logger');

const paginate = (resultData, params = {}) => {
    const {pageNumber, pageSize} = params;
    const pagination = {
        pageSize: (!pageSize || pageSize < 1) ? 10 : Number(pageSize),
        pageNumber: (!pageNumber || pageNumber < 1) ? 1 : Number(pageNumber),
    }
    pagination.offset = Number((pagination.pageNumber - 1) * pagination.pageSize);
    pagination.total = resultData.length || 0;
    pagination.pages = Math.ceil(pagination.total/pagination.pageSize);
    pagination.current =  pagination.pageNumber;
    pagination.previous = (pagination.current > 1) ? pagination.current - 1 : pagination.current;
    pagination.next = (pagination.pages > pagination.current) ? pagination.current + 1 : pagination.current;

    const result = resultData.slice(pagination.offset, pagination.pageSize);
    logger.info(JSON.stringify(`${pagination} ${resultData}`));
    return {pagination, result}
}

module.exports = {
    paginate
}
