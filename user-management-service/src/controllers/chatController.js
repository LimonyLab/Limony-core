const Conversation = require('../models/Conversation');

exports.newMessage = async (req, res) => {
  const { content } = req.body;
  const sender = req.user.email; // extracting user email from auth middleware
  
  try {
    const message = new Message({
      content,
      sender,
      recipient: 'supervisor', // if supervisor is a specific email, replace it here
    });

    await message.save();

    res.status(200).json({
      message: 'Message sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was a server error',
    });
  }
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