// rout /api/v1/bootcamps
//access Public

const getAll = (req, res, next) => {
	res.status(200).json({
		status : 'Success',
		msg    : 'get all bootcamps'
	});
};

const postOne = (req, res, next) => {
	res.status(200).json({
		status : 'Success',
		msg    : 'post a bootcamp'
	});
};

const getOne = (req, res, next) => {
	res.status(200).json({
		msg : 'get one message'
	});
};
const deleteOne = (req, res, next) => {
	res.status(200).json({
		status : 'Success',
		msg    : 'delete one message'
	});
};
const updateOne = (req, res, next) => {
	res.status(200).json({
		status : 'Success',
		msg    : 'update one message'
	});
};
module.exports = {
	getAll,
	getOne,
	updateOne,
	deleteOne,
	postOne
};
