const advanceResults = (model, populate) => async (req, res, next) => {
	let query;
	//Copy req.query
	const reqQuery = { ...req.query };
	//Fields to exclude from filtering
	const removeFields = [ 'select', 'sort', 'limit', 'page' ];
	//loop over removeFields and delet them from reqQuery
	removeFields.forEach((item) => delete reqQuery[item]);
	//Create Query string
	let queryStr = JSON.stringify(reqQuery);
	//Create operators($gt/$gtr etx...)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
	//Finding resources
	query = model.find(JSON.parse(queryStr));
	//Select fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}
	//Sort fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('createdAt');
	}
	//Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();
	query.skip(startIndex).limit(limit);
	if (populate) {
		query = query.populate(populate);
	}
	//Executing query
	const items = await query;

	//Pagination result
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page  : page + 1,
			limit
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page  : page - 1,
			limit
		};
	}
	res.advanceResults = {
		status     : 'Success',
		count      : items.length,
		pagination : pagination,
		data       : items
	};
	next();
};

module.exports = advanceResults;
