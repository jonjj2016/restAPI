const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/sendemail');

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
	});
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
//desc Get current logged in user
//route /api/v1/user/me
//access Privat
exports.getme = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({
		status : 'Success',
		data   : user
	});
});
//desc forgot  password
//route /api/v1/user/forgotpassword
//access Pblic
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return next(new ErrorResponse(`There is no user with ${email} email address !`, 404));
	}
	//Get our reset token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	//Create reset url
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`;
	const message = `You are receiving this email because you or someone elese has requested the reset of a passsword .Please make a PUT requeset to \n\n ${resetURL}`;
	try {
		await sendEmail({ email: user.email, subject: 'Password reset token', message });
		res.status(200).json({
			status : 'Success',
			data   : 'Email sent'
		});
	} catch (err) {
		user.resetPasswordExpire = undefined;
		user.resetPasswordToken = undefined;
		await user.save({ validateBeforeSave: false });
		next(new ErrorResponse('Email could not be sent'));
	}
});
//desc Reset password
//route /api/v1/user/resetpassword/:resettoken
//access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	const resetToken = req.params.resettoken;
	const encrepted = crypto.createHash('sha256').update(resetToken).digest('hex');
	const user = await User.findOne({ resetPasswordToken: encrepted, resetPasswordExpire: { $gt: Date.now() } });
	if (!user || !req.body.password) {
		return next(new ErrorResponse(`Invalid Credentials`, 400));
	}
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	user.password = req.body.password;
	await user.save({ validateBeforeSave: false });
	sendtokenResponse(user, 201, res);
});
//desc PATCH update user details
//route /api/v1/user/update
//access Privat
// exports.getme = asyncHandler(async (req, res, next) => {
// 	const user = await User.findById(req.user.id);
// 	res.status(200).json({
// 		status : 'Success',
// 		data   : user
// 	});
// });
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		email : req.body.email,
		name  : req.body.name
	};
	const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true });
	req.user = updatedUser;
	sendtokenResponse(updatedUser, 201, res);
	// res.status(200).json({
	// 	status : 'Success',
	// 	data   : updatedUser
	// });
});
//desc PATCH update user details
//route /api/v1/user/update
//access Privat
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');
	const isMatch = await user.matchPassword(req.body.password);
	if (
		!req.body.password ||
		!req.body.newPassword ||
		req.body.newPassword !== req.body.confirmPassword ||
		!req.body.confirmPassword
	) {
		return next(new ErrorResponse(`Invalid Credentials`, 400));
	}

	if (!isMatch) {
		return next(new ErrorResponse(`Invalid Credentials`, 400));
	}

	user.password = req.body.newPassword;
	await user.save({ runValidators: true });
	sendtokenResponse(user, 201, res);
});
