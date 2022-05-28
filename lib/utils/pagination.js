'use strict';

const {logger} = require('./logger');

const paginate = (resultData, params = {}) => {
    const pagination = {}

    if (!params || params === {}) {
        pagination.pageSize = 10;
        pagination.pageNumber = 1;
    } else {
        if(!params.pageSize) params.pageSize = 10;
        if(!params.pageNumber) params.pageNumber = 1;
        pagination.pageSize = params.pageSize < 1 ? 1 : params.pageSize;
        pagination.pageNumber = params.pageNumber < 1 ? 1 : params.pageNumber;
    }

    pagination.offset = Number((pagination.pageNumber - 1) * pagination.pageSize);
    const result = resultData.slice(pagination.offset, pagination.pageSize);
    logger.info(JSON.stringify(`${pagination} ${resultData}`));
    return {pagination, result}
}


module.exports = {
    paginate
}
