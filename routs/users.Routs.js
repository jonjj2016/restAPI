const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const advanceQuery = require('../middleware/AdvanceQuery');
const model = require('../models/user');
const controllers = require('../controllers/user.Controller');
const router = express.Router();
router.get('/', protect, authorize('admin'), advanceQuery(model), controllers.getAllUsers);
router.post('/', protect, authorize('admin'), controllers.postUser);
router.delete('/:id', protect, authorize('admin'), controllers.deleteUser);
router.put('/:id', protect, authorize('admin'), controllers.updateUser);
router.get('/:id', protect, authorize('admin'), controllers.getUser);

module.exports = router;
