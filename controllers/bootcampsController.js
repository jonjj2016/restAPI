const path = require('path');
const Bootcamp = require('../models/bootcampModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geoCoder = require('../utils/giocoder');
// rout /api/v1/bootcamps
//access Public

const getAll = asyncHandler(async (req, res, next) => {
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
	query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
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
	const total = await Bootcamp.countDocuments();
	query.skip(startIndex).limit(limit);
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
	res.status(200).json({
		status     : 'Success',
		count      : items.length,
		pagination,
		data       : items
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
	let item = await Bootcamp.findById(req.params.id).exec();
	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 404));
	}
	item.remove();
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
//desc Upload photo for bootcmp
//rout Put /api/v1/bootcamp/:id/photo
const bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
	let item = await Bootcamp.findById(req.params.id).exec();
	const file = req.files.file;
	if (!item) {
		return next(new ErrorResponse(`Couldn't update Bootcamp with id ${req.params.id}`, 404));
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
