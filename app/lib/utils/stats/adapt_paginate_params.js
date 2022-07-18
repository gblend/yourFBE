module.exports.adaptPaginateParams = (pageSize, pageNumber) => {
	pageSize = (!pageSize || pageSize < 1) ? 10 : Number(pageSize);
	pageNumber = (!pageNumber || pageNumber < 1) ? 1 : Number(pageNumber);
	const offset = Number((pageNumber - 1) * pageSize);

	return {
		pageSize,
		pageNumber,
		offset,
	}
}
