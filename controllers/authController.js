const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
//Get token from model and creates cookie and responds
const sendtokenResponse = (user, statuscode, res) => {
	//create token
	const token = user.getSignedJwtToken();
	const options = {
		expires  : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
		httpOnly : true
	};
	if ((process.env.NODE_ENV = 'production')) {
		options.secure = true;
	}
	res.status(statuscode).cookie('token', token, options).json({
		status : 'Success',
		token
	});
};

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
	sendtokenResponse(user, 200, res);

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
	sendtokenResponse(user, 200, res);

	next();
});
