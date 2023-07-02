const Conversation = require('../models/Conversation');

exports.newMessage = async (req, res) => {
    const userId = req.user._id;
    const { message } = req.body;

    // Retrieve the user's conversation
    const userConversation = conversations.get(userId) || [];

    // Add the new message to the user's conversation
    userConversation.push({
    sender: 'user',
    message,
    timestamp: new Date(),
    });

    // Update the conversation in the Map
    conversations.set(userId, userConversation);

    // Here, implement the logic to send the message to the supervisor
    // You can use WebSocket, Server-Sent Events, etc.

    res.status(200).json({ message: 'Message sent' });
};

exports.getMessages = async (req, res) => {
    const userId = req.user._id;

    // Retrieve the user's conversation from the Map
    const userConversation = conversations.get(userId);

    res.status(200).json({ conversation: userConversation });
};


exports.sendMessage = async (req, res) => {
    const { userId, message } = req.body;
  
    // Retrieve the user's conversation
    const userConversation = conversations.get(userId) || [];
  
    // Add the supervisor's message to the user's conversation
    userConversation.push({
      sender: 'supervisor',
      message,
      timestamp: new Date(),
    });
  
    // Update the conversation in the Map
    conversations.set(userId, userConversation);
  
    // Here, implement the logic to send the message to the user
    // You can use WebSocket, Server-Sent Events, etc.
  
    res.status(200).json({ message: 'Message sent' });
  };