import { IPagination } from '../../interface';

export const paginate = async (resultData: any, params: IPagination = {}) => {
  const { pageNumber, pageSize } = params;
  const pagination = {
    pageSize: !pageSize || pageSize < 1 ? 10 : Number(pageSize),
    pageNumber: !pageNumber || pageNumber < 1 ? 1 : Number(pageNumber),
    offset: 0,
    total: 0,
    pages: 0,
    current: 0,
    previous: 0,
    next: 0,
  };
  pagination.offset = Number((pagination.pageNumber - 1) * pagination.pageSize);

  let result;
  if (
    Object.keys(resultData).includes('mongooseCollection') ||
    Object.keys(resultData).includes('schema')
  ) {
    pagination.total = await resultData.clone().countDocuments();
    pagination.pages = Math.ceil(pagination.total / pagination.pageSize);
    result = resultData.skip(pagination.offset).limit(pagination.pageSize);
  } else {
    pagination.total = resultData.length || 0;
    pagination.pages = Math.ceil(pagination.total / pagination.pageSize);
    result = resultData.slice(
      pagination.offset,
      pagination.pageSize + pagination.offset,
    );
  }

  pagination.current = pagination.pageNumber;
  pagination.previous =
    pagination.current > 1 ? pagination.current - 1 : pagination.current;
  pagination.next =
    pagination.pages > pagination.current
      ? pagination.current + 1
      : pagination.current;

  return { pagination, result };
};
