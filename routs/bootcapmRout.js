const express = require('express');
//import controller
const controller = require('../controllers/bootcampsController');
const routs = express.Router();
routs.route('/').get(controller.getAll).post(controller.postOne);
routs.route('/:id').get(controller.getOne).delete(controller.deleteOne).patch(controller.updateOne);
routs.route('/radius/:zipcode/:distance').get(controller.getBootcampsInRadius);
module.exports = routs;
