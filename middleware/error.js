const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
	let error = {
		...err
	};
	error.message = err.message;
	//Log to console for dev
	console.log(err);
	if (err.name === 'CastError') {
		const message = `Resource not found `;
		error = new ErrorResponse(message, 404);
	}
	//Mongoose duplicate key
	if (err.code === 11000) {
		const itemArray = Object.keys(err.keyPattern);
		const message = `Resource already contains item with the same ${itemArray[0]}`;
		error = new ErrorResponse(message, 400);
	}
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((item) => item.message);
		error = new ErrorResponse(message, 400);
	}
	res.status(error.statusCode || 500).json({
		status : 'Fail',
		error  : error.message || 'Server Error'
	});
};

module.exports = errorHandler;
