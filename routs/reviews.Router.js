const express = require('express');
const model = require('../models/reviews.Model');
const { protect, authorize } = require('../middleware/auth');

const controllers = require('../controllers/review.Controller');
//Midlewares
const advanceQuery = require('../middleware/AdvanceQuery');
const router = express.Router({ mergeParams: true });
router.use(protect);
//router.use(authorize('admin'));
router
	.route('/')
	.get(advanceQuery(model, { path: 'bootcamp', select: 'name description' }), controllers.allReviews)
	.post(protect, authorize('user', 'admin'), controllers.postReview);
router
	.route('/:id')
	.delete(protect, controllers.deleteReview)
	.patch(protect, controllers.updateReview)
	.get(protect, controllers.getOneReview);

module.exports = router;
