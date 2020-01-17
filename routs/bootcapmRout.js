const express = require('express');
//import controller
const controller = require('../controllers/bootcampsController');
//Include other resource routers
const model = require('../models/bootcampModel');
const courseRouter = require('./coursesRoute');
const advanceQuery = require('../middleware/AdvanceQuery');
const { protect, authorize } = require('../middleware/auth');
const routs = express.Router();
//Re-Route into other resource routers
routs.use('/:bootcampId/courses', courseRouter);
routs
	.route('/')
	.get(advanceQuery(model, 'courses'), controller.getAll)
	.post(protect, authorize('publisher', 'admin'), controller.postOne);
routs
	.route('/:id')
	.get(controller.getOne)
	.delete(protect, authorize('publisher', 'admin'), controller.deleteOne)
	.patch(protect, authorize('publisher', 'admin'), controller.updateOne);
routs.route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);
routs.route('/:id/photo').put(protect, authorize('publisher', 'admin'), controller.bootcampUploadPhoto);
module.exports = routs;
