const express = require('express');
const controller = require('../controllers/authController');
const authController = require('../middleware/auth');
const router = express.Router();
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authController.protect, controller.getme);

module.exports = router;
