const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geoCoder = require('../utils/giocoder');
// rout /api/v1/bootcamps
//access Public

const getAll = asyncHandler(async (req, res, next) => {
	const items = await Bootcamp.find({});
	res.status(200).json({
		status : 'Success',
		count  : items.length,
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
//Get bootcamps within a radius
// rout /api/v1/bootcamps/radius/:zipcode/:distance

const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;
	//Get lat/lng from geocoder
	const loc = await geoCoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;
	//Calc radius using radients
	//Divide dist by radius of Earth
	//Earth radius 3963 miles
	const radius = distance / 3963;
	const bootcamps = await Bootcamp.find({
		location : { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
	});
	res.status(200).json({
		status : 'Success',
		count  : bootcamps.length,
		data   : bootcamps
	});
});
module.exports = {
	getAll,
	getOne,
	updateOne,
	deleteOne,
	postOne,
	getBootcampsInRadius
};
