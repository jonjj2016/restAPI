const express = require('express');
const controller = require('../controllers/coursesController');
const model = require('../models/courseModel');
const { protect, authorize } = require('../middleware/auth');

const advanceQuery = require('../middleware/AdvanceQuery');
const router = express.Router({ mergeParams: true });
router
	.route('/')
	.get(advanceQuery(model, { path: 'bootcamp', select: 'name description' }), controller.getMany)
	.post(protect, authorize('publisher', 'admin'), controller.postOne);
router
	.route('/:id')
	.get(controller.getOne)
	.patch(protect, authorize('publisher', 'admin'), controller.updateOne)
	.delete(protect, authorize('publisher', 'admin'), controller.deleteOne);
module.exports = router;
