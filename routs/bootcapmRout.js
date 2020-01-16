const express = require('express');
//import controller
const controller = require('../controllers/bootcampsController');
//Include other resource routers
const model = require('../models/bootcampModel');
const courseRouter = require('./coursesRoute');
const advanceQuery = require('../middleware/AdvanceQuery');
const routs = express.Router();
//Re-Route into other resource routers
routs.use('/:bootcampId/courses', courseRouter);
routs.route('/').get(advanceQuery(model, 'courses'), controller.getAll).post(controller.postOne);
routs.route('/:id').get(controller.getOne).delete(controller.deleteOne).patch(controller.updateOne);
routs.route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);
routs.route('/:id/photo').put(controller.bootcampUploadPhoto);
module.exports = routs;
