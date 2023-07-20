const express = require('express');
const userController = require('../controllers/userController');
const {auth} = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
//router.get('/profile', auth, userController.getProfile); // protected route
router.get('/profile', auth, userController.test); // protected route
router.put('/profile', auth, userController.updateProfile); // protected route
router.delete('/profile', auth, userController.deleteProfile); // protected route

module.exports = router;
