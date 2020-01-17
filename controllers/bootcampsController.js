const path = require('path');
const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geoCoder = require('../utils/giocoder');
// rout /api/v1/bootcamps
//access Public

const getAll = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advanceResults);
});

const postOne = asyncHandler(async (req, res, next) => {
	//Add user to req.body
	req.body.user = req.user.id;
	//Check for published bootcamp
	const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id });
	//if the user is not an admin they can only add one bootcamp
	if (publishedBootcamps && req.user.role !== 'admin') {
		return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
	}
	const bootcamp = await Bootcamp.create({ ...req.body }); //, user: req.user._id
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
	let item = await Bootcamp.findById(req.params.id).exec();
	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 404));
	}
	//Make sure that its owner who deletes the bootcamp or admin
	if (req.user.id !== item.user.toString() && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User ${req.user.id} is not autherized to delete this Bootcamp`, 401));
	}
	item.remove();
	res.status(204).json({
		status : 'Success',
		data   : null
	});
});
const updateOne = asyncHandler(async (req, res, next) => {
	let item = await Bootcamp.findById(req.params.id);
	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 400));
	}
	//Make sure user is bootcamp owner
	if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User ${req.user.id} is not autherized to update this Bootcamp`, 401));
	}
	item = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });

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
//desc Upload photo for bootcmp
//rout Put /api/v1/bootcamp/:id/photo
const bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
	let item = await Bootcamp.findById(req.params.id).exec();
	const file = req.files.file;
	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 404));
	}
	if (item.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse(`User ${req.user.id} is not autherized to update bootcamp`, 401));
	}
	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an image file`, 400));
	}
	if (file.size > process.env.PHOTO_LIMIT) {
		return next(
			new ErrorResponse(
				`${file.size / 1000000} Image size should be no more then ${process.env.PHOTO_LIMIT / 1000000}mb`,
				400
			)
		);
	}
	//Create custom filename
	file.name = `photo_${item._id}${path.parse(file.name).ext}`;
	//saving photo
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}
		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
		res.status(200).json({
			status : 'Success',
			data   : file.name
		});
	});
});
module.exports = {
	getAll,
	getOne,
	updateOne,
	deleteOne,
	postOne,
	getBootcampsInRadius,
	bootcampUploadPhoto
};
