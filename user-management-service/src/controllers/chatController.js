const Conversation = require('../models/Conversation');

exports.newMessage = async (req, res) => {
  const { content } = req.body;
  const sender = req.user.email; // extracting user email from auth middleware

  try {
    let conversation = await Conversation.findOne({ userId: req.user._id });

    if (!conversation) {
      conversation = new Conversation({
        userId: req.user._id,
      });
    }

    conversation.messages.push({
      sender,
      content: content,
      recipient: 'supervisor'
    });

    await conversation.save();

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
  try {
    const conversation = await Conversation.findOne({ userId: req.user._id });

    if (!conversation) {
      return res.status(200).json({ conversation: [] });
    }

    res.status(200).json({ conversation: conversation.messages });
  } catch (error) {
    res.status(500).json({ error: 'There was a server error' });
  }
};

exports.sendMessage = async (req, res) => {
  const { userId, message } = req.body;

  try {
    let conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      conversation = new Conversation({
        userId,
      });
    }

    conversation.messages.push({
      sender: 'supervisor',
      message,
      timestamp: new Date(),
    });

    await conversation.save();

    // Here, implement the logic to send the message to the user
    // You can use WebSocket, Server-Sent Events, etc.

    res.status(200).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: 'There was a server error' });
  }
};
