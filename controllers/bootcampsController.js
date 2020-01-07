const Bootcamp = require('../models/bootcampModel');

// rout /api/v1/bootcamps
//access Public

const getAll = async (req, res, next) => {
	const bootcamps = await Bootcamp.find({});
	res.status(200).json({
		status : 'Success',
		items  : bootcamps.length,
		data   : bootcamps
	});
};

const postOne = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(200).json({
			status : 'Success',
			data   : bootcamp
		});
	} catch (err) {
		res.status(400).json({
			status  : 'Fail',
			message : err.message
		});
	}
};

const getOne = async (req, res, next) => {
	try {
		const item = await Bootcamp.findById(req.params.id).exec();
		res.status(200).json({
			status : 'Success',
			item   : item
		});
	} catch (err) {
		res.status(404).json({
			status  : 'Fail',
			message : err.message
		});
	}
};
const deleteOne = async (req, res, next) => {
	try {
		await Bootcamp.findByIdAndRemove(req.params.id).exec();
		res.status(204).json({
			status : 'Success',
			data   : null
		});
	} catch (err) {
		res.status(404).json({
			status  : 'Fail',
			message : err.message
		});
	}
};
const updateOne = async (req, res, next) => {
	try {
		const item = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			runValidators : false,
			new           : true
		}).exec();
		res.status(200).json({
			status : 'Success',
			data   : item
		});
	} catch (err) {
		res.status(200).json({
			status  : 'Fail',
			message : err.message
		});
	}
};
module.exports = {
	getAll,
	getOne,
	updateOne,
	deleteOne,
	postOne
};
