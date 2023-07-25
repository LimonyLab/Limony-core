const express = require('express');
const userController = require('../controllers/userController');
const {auth, roleAuth, chatPathAuth} = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, roleAuth, userController.getProfile); // protected route
router.put('/profile', auth, roleAuth, userController.updateProfile); // protected route
router.delete('/profile', auth, roleAuth, userController.deleteProfile); // protected route

module.exports = router;
