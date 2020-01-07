const express = require('express');
//import controller
const controller = require('../controllers/bootcampsController');
const routs = express.Router();
routs.route('/').get(controller.getAll).post(controller.postOne);
routs.route('/:id').get(controller.getOne).delete(controller.deleteOne).patch(controller.updateOne);
module.exports = routs;
