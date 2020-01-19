const express = require('express');
const model = require('../models/user');
const controllers = require('../controllers/user.Controller');
//Midlewares
const advanceQuery = require('../middleware/AdvanceQuery');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();
router.use(protect);
router.use(authorize('admin'));
router.route('/').get(advanceQuery(model), controllers.getAllUsers).post(controllers.postUser);
router.route('/:id').delete(controllers.deleteUser).put(controllers.updateUser).get(controllers.getUser);

module.exports = router;
