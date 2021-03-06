// desc Courses routs
// route /bootcamps/:bootcamp/:courses
// route api/v1/courses

const Course = require('../models/courseModel');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
//Get course
//route Get /api/v1/courses
//access Privat
const getMany = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		res.status(200).json({
			status : 'Success',
			count  : courses.length,
			data   : courses
		});
	} else {
		res.status(200).json(res.advanceResults);
	}
});
//Add course
//route POST /api/v1/bootcamp/:bootcampId/courses
//access Privat
const postOne = asyncHandler(async (req, res, next) => {
	const id = req.params.bootcampId;

	req.body.bootcamp = id;
	req.body.user = req.user.id;
	const bootcamp = await Bootcamp.findById(id).exec();
	if (!bootcamp) {
		return next(new ErrorResponse(`There is no Bootcamp with an Id ${id}`, 404));
	}
	const item = await Course.create(req.body);
	res.status(200).json({
		status : 'Success',
		data   : item
	});
});
//Get one Course
//route POST /api/v1/courses/:id
//access Privat
const getOne = asyncHandler(async (req, res, next) => {
	const item = await Course.findById(req.params.id).exec();

	if (!item) {
		return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));
	}
	res.status(200).json({
		status : 'Success',
		data   : item
	});
});
//Get one Course
//route POST /api/v1/courses/:id
//access Privat
const updateOne = asyncHandler(async (req, res, next) => {
	let item = await Course.findById(req.params.id);
	if (!item) {
		return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));
	}
	if (req.user.id !== item.user.toString() && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User ${req.user.id} is not autherized to update this Course ${item.id}`, 401));
	}
	item = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
	res.status(200).json({
		status : 'Success',
		data   : item
	});
});

const deleteOne = asyncHandler(async (req, res, next) => {
	let item = await Course.findById(req.params.id);
	console.log(item.user);
	if (!item) {
		return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));
	}
	if (req.user.id !== item.user.toString() && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User ${req.user.id} is not autherized to delete this Course ${item.id}`, 401));
	}
	await Course.findByIdAndRemove(req.params.id);
	res.status(204).json({
		status : 'Success',
		data   : null
	});
});
module.exports = {
	getMany,
	postOne,
	getOne,
	deleteOne,
	updateOne
};
