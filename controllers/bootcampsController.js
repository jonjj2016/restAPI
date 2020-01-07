const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// rout /api/v1/bootcamps
//access Public

const getAll = asyncHandler(async (req, res, next) => {
	const items = await Bootcamp.find({});
	res.status(200).json({
		status : 'Success',
		items  : items.length,
		data   : items
	});
});

const postOne = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(200).json({
		status : 'Success',
		data   : bootcamp
	});
});

const getOne = asyncHandler(async (req, res, next) => {
	const item = await Bootcamp.findById(req.params.id).exec();
	if (!item) {
		return next(new ErrorResponse(`Couldnt get the Bootcamp with id ${req.params.id}`, 404));
	}
	res.status(200).json({
		status : 'Success',
		item   : item
	});
});
const deleteOne = asyncHandler(async (req, res, next) => {
	let item = await Bootcamp.findByIdAndRemove(req.params.id).exec();
	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 400));
	}
	res.status(204).json({
		status : 'Success',
		data   : null
	});
});
const updateOne = asyncHandler(async (req, res, next) => {
	const item = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new           : true,
		runValidators : false
	});

	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 400));
	}
	res.status(301).json({
		status : 'Success',
		data   : item
	});
});
module.exports = {
	getAll,
	getOne,
	updateOne,
	deleteOne,
	postOne
};
