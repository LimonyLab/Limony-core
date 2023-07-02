const express = require('express');
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');
const router = express.Router();

// Route to handle a new message from a user
router.post('/new-message', auth, chatController.newMessage);

// Route to fetch messages for a given user
router.get('/get-messages', auth, chatController.getMessages);

// Route for supervisor to send message to a user
router.post('/send-message', auth, chatController.sendMessage);

module.exports = router;
