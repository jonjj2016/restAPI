const express = require('express');
const controller = require('../controllers/coursesController');
const router = express.Router({ mergeParams: true });
router.route('/').get(controller.getMany).post(controller.postOne);
router.route('/:id').get(controller.getOne).patch(controller.updateOne).delete(controller.deleteOne);
module.exports = router;
