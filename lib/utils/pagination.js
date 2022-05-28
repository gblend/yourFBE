const {logger} = require('./index');
const paginate = async (params, resultData) => {
    const pagination = {}

    if (!params) {
        pagination.pageSize = 10;
        pagination.pageNumber = 1;
    } else {
        pagination.pageSize = params.pageSize;
        pagination.pageNumber = params.pageNumber;
    }

    pagination.offset = Number((pagination.pageNumber - 1) * pagination.pageSize);
    const result = await resultData.skip(pagination.offset).limit(pagination.pageSize);
    logger.info(JSON.stringify(`${pagination} ${resultData}`));
    return {pagination, result}
}


module.exports = {
    paginate
}
