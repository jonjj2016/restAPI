const express = require('express');
//import controller
const controller = require('../controllers/bootcampsController');
//Include other resource routers
const courseRouter = require('./coursesRoute');
const routs = express.Router();
//Re-Route into other resource routers
routs.use('/:bootcampId/courses', courseRouter);
routs.route('/').get(controller.getAll).post(controller.postOne);
routs.route('/:id').get(controller.getOne).delete(controller.deleteOne).patch(controller.updateOne);
routs.route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);
routs.route('/:id/photo').put(controller.bootcampUploadPhoto);
module.exports = routs;
