const asyncHandler = require('../middleware/async');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
//desc Get all users
//path Get /api/v1/auth/users
//access Privat Admin only
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advanceResults);
	next();
});
//desc Post user
//path Post /api/v1/auth/users
//access Privat Admin only
exports.postUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(200).json({
		status : 'Success',
		data   : user
	});
});
//desc Get a user
//path Get /api/v1/auth/users/:id
//access Privat Admin only
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new ErrorResponse(`No user with id ${req.params.id} `, 404));
	}
	res.status(200).json({
		status : 'Success',
		data   : user
	});
});
//desc Delete a user
//path Delete /api/v1/auth/users/:id
//access Privat Admin only
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new ErrorResponse(`No user with id ${req.params.id} `, 404));
	}
	user.remove();
	res.status(202).json({
		status : 'Success',
		data   : null
	});
});
//desc Update a user
//path Put /api/v1/auth/users/:id
//access Privat Admin only
exports.updateUser = asyncHandler(async (req, res, next) => {
	console.log(req.user.role);
	const user = await User.findById(req.params.id);
	if (!user) {
		return next(new ErrorResponse(`No user with id ${req.params.id} `, 404));
	}
	const updayedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
	res.status(200).json({
		status : 'Success',
		data   : updayedUser
	});
});
