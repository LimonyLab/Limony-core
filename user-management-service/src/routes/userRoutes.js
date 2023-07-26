const express = require('express');
const userController = require('../controllers/userController');
const {auth, roleAuth, chatPathAuth} = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.get('/profile', auth, roleAuth, userController.getProfile); 
router.put('/profile', auth, roleAuth, userController.updateProfile); 
router.delete('/profile', auth, roleAuth, userController.deleteProfile); 
module.exports = router;
