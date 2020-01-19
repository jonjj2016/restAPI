const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/reviews.Model');
const Bootcamp = require('../models/bootcampModel');
//Get reviews
//route Get /api/v1/revews
//route Get /api/v1/bootcamp/:bootcampId/reviews
//access Privat
exports.allReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({ bootcamp: req.params.bootcampId });
		res.status(200).json({
			status : 'Success',
			count  : reviews.length,
			data   : reviews
		});
	} else {
		res.status(200).json(res.advanceResults);
	}
});
//Post review
//route Post /api/v1/bootcamp/:bootcampId/reviews
//access Privat
exports.postReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;
	const bootcamp = await Bootcamp.findById(req.params.bootcampId);
	if (!bootcamp) {
		return next(new ErrorResponse(`There is no Bootcamp with id ${req.params.bootcampId} `, 404));
	}
	const review = await (await Review.create(req.body)).populate({ path: 'bootcamp', select: 'name description' });

	res.status(201).json({
		status : 'Success',
		data   : review
	});
});
//Delete review
//route Delete /api/v1/reviews/:id
//access Privat
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) {
		return next(new ErrorResponse(`No review with id ${req.params.id}, 404`));
	}
	//Check if its reviews owner is deleting or not
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(`User with id ${req.user.id} is not alowed to delete review ${req.params.id}`, 401)
		);
	}
	await review.remove();
	res.status(204).json({
		status : 'Success',
		data   : null
	});
});
//Get one review
//route get /api/v1/reviews/:id
//access Privat
exports.getOneReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({ path: 'bootcamp', select: 'name description' });
	if (!review) {
		return next(new ErrorResponse(`No review with id ${req.params.id}`, 404));
	}
	res.status(202).json({
		status : 'Success',
		data   : review
	});
});
//Update one review
//route put /api/v1/reviews/:id
//access Privat
exports.updateReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) {
		return next(new ErrorResponse(`No review with id ${req.params.id}`, 404));
	}
	//Check if its reviews owner is updatng or not

	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(`User with id ${req.user.id} is not alowed to update review ${req.params.id}`, 401)
		);
	}
	const updatedRevew = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
	res.status(202).json({
		status : 'Success',
		data   : updatedRevew
	});
});
