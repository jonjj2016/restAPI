// desc Courses routs
// route /bootcamps/:bootcamp/:courses
// route api/v1/courses

const Course = require('../models/courseModel');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const getMany = asyncHandler(async (req, res, next) => {
	let query;
	if (req.params.bootcampId) {
		query = Course.find({ bootcamp: req.params.bootcampId });
	} else {
		query = Course.find();
	}
	const courses = await query;
	res.status(200).json({
		status : 'Success',
		count  : courses.length,
		data   : courses
	});
});
const posOne = asyncHandler(async (req, res, next) => {
	const item = await Course.create(req.body);
	res.status(200).json({
		status : 'Success',
		data   : item
	});
});
const getOne = asyncHandler(async (req, res, next) => {
	const item = await Course.findById(req.params.id);
	res.status(200).json({
		status : 'Success',
		data   : item
	});
});
const updateOne = asyncHandler(async (req, res, next) => {
	const item = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
	res.status(200).json({
		status : 'Success',
		data   : item
	});
});

const deleteOne = asyncHandler(async (req, res, next) => {
	await Course.findByIdAndRemove(req.params.id);
	res.status(204).json({
		status : 'Success',
		data   : null
	});
});
module.exports = {
	getMany,
	posOne,
	getOne,
	deleteOne,
	updateOne
};
