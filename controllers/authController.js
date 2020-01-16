const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

//desc Register User
//route  /api/v1/auth/register
//access public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role
	}).select('-password');
	const token = user.getSignedJwtToken();
	res.status(200).json({
		status : 'Success',
		token  : token,
		data   : user
	});

	next();
});
//desc Login user
//route /api/v1/user/login
//access Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	//validate email and password
	if (!email || !password) {
		return next(new ErrorResponse('Please provide an email and password', 400));
	}
	//check for the user
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}
	//check if password matches
	const checkPassword = await user.matchPassword(password);
	if (!checkPassword) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}
	const token = user.getSignedJwtToken();
	res.status(200).json({
		status : 'Success',
		token
	});
	next();
});
