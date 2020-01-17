const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
//Protect routs
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}
	// to take token from cookies
	// if (req.cookies.token) {
	// 	token = req.cookies.token;
	// }

	//Make sure token exists

	if (!token) {
		return next(new ErrorResponse('Not Authorized to access this rout', 401));
	}

	//Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);

		next();
	} catch (err) {
		next(new ErrorResponse('Not Authorized to access this rout', 401));
	}
});
//Grant Access
exports.authorize = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
	}
	next();
};
