export const mapPaginatedData = (
  data: any[],
  pageSize: number,
  pageNumber: number,
) => {
  const result = data[0].paginatedResults;
  const total = data[0].feeds[0].count;
  pageNumber = Number(pageNumber);
  pageSize = Number(pageSize);
  const pages = Math.ceil(total / pageSize);
  const previous = pageNumber > 1 ? pageNumber - 1 : pageNumber;
  const next = pages > pageNumber ? pageNumber + 1 : pageNumber;

  return {
    result,
    total,
    pages,
    previous,
    next,
  };
};
