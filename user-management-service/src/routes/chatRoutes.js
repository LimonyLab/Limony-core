const express = require('express');
const chatController = require('../controllers/chatController');
const { auth, roleAuth, chatPathAuth } = require('../middleware/auth');
const router = express.Router();

// Route to handle a new message from a user
router.post('/new-message', auth, chatController.newMessage); 

// Route to fetch messages for a given user
router.get('/get-messages', auth, chatController.getMessages);

// Route for supervisor to send message to a user
router.post('/send-message', auth, chatController.sendMessage);

// Route for supervisor to view the conversations in his panel
router.get('/all-conversations', auth, roleAuth, chatController.getAllConversations);


// Route for supervisor to get the email of the person who is on the other side of the conversation
router.get('/metadata/:conversationId', auth, chatController.getChatMetdata);



module.exports = router;
