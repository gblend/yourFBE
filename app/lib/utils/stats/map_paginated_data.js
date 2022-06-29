module.exports.mapPaginatedData = (data, pageSize, pageNumber) => {
	const result = data[0].paginatedResults;
	const total = data[0].feeds[0].count;
	const pages = Math.ceil(total / pageSize);
	const previous = (pageNumber > 1) ? pageNumber - 1 : pageNumber;
	const next = (pages > pageNumber) ? pageNumber + 1 : pageNumber;

	return {
		result,
		total,
		pages,
		previous,
		next,
	}
}
