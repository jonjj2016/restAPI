const express = require('express');
const controller = require('../controllers/coursesController');
const model = require('../models/courseModel');
const advanceQuery = require('../middleware/AdvanceQuery');
const router = express.Router({ mergeParams: true });
router
	.route('/')
	.get(advanceQuery(model, { path: 'bootcamp', select: 'name description' }), controller.getMany)
	.post(controller.postOne);
router.route('/:id').get(controller.getOne).patch(controller.updateOne).delete(controller.deleteOne);
module.exports = router;
