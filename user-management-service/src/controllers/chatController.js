const Conversation = require('../models/Conversation');


// Ordinary server functionality

let newMessage = async (req, res) => {
  const { content } = req.body;
  const sender = req.user.email; // extracting user email from auth middleware

  try {
    let conversation = await Conversation.findOne({ userId: req.user._id });
    if (!conversation) {
      conversation = new Conversation({
        userId: req.user._id,
      });
    }
    console.log(req.user);
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

let getMessages = async (req, res) => {
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

let sendMessage = async (req, res) => {
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

let getAllConversations = async (req, res) => {
  console.log("We are at line 80")
  // check if the role of the user is supervisor
  if (req.user.role !== 'supervisor') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    console.log("We are at line 87")

    const conversations = await Conversation.find()
      .populate('userId', 'email -_id') // populate the email of the user
      .lean() // convert mongoose document to JS object to allow adding the lastUpdated field
      .exec(); // execute the query

    // loop over conversations and add the lastUpdated field
    conversations.forEach(conversation => {
      if (conversation.messages.length != 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        conversation.lastUpdated = lastMessage.updatedAt;
      }
    });

    console.log('We are at line 102');

    return res.status(200).json({ conversations });
  } catch (error) {
    console.log("We are at line 105")
    console.log(error);
    return res.status(500).json({ error: 'There was a server error' });
  }
};  



let getChatMetdata = async (req, res) => {
  
  try {
    const { conversationId } = req.params;

    // find conversation by its ID and populate user details
    const conversation = await Conversation.findById(conversationId).populate('userId', 'email -_id');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // get the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    console.log('conversation id is: ', conversationId);
    console.log('Returning this lastMessage: ', lastMessage.updatedAt);
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - -');
    

    // return the conversation details along with user's email and last update time
    res.status(200).json({ 
      _id: conversation._id,
      email: conversation.userId.email,
      lastUpdated: lastMessage.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'There was a server error' });
  }
};



// Supervisor functionality
let newMessageSupervisorChat = async (req, res) => {
  const { content } = req.body;
  const sender = req.user.email; // extracting user email from auth middleware
  const { conversationId } = req.params; // get conversationId from URL parameters

  try {
    let conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
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

let getMessagesSupervisorChat = async (req, res) => {
  const { conversationId } = req.params; // get conversationId from URL parameters
  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json({ conversation: conversation.messages });
  } catch (error) {
    res.status(500).json({ error: 'There was a server error' });
  }
};


// Combining newMessage and newMessageSupervisorChat controllers
let newMessage_ = async (req, res) => {
  const { content } = req.body;
  const sender = req.user.email; // extracting user email from auth middleware
  const { conversationId } = req.params; // get conversationId from URL parameters

  // First we need to make sure the user is authorized to use this route. 

  try {
    let conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
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




module.exports = {
  newMessage,
  getMessages,
  sendMessage,
  getAllConversations,
  getChatMetdata,
  newMessageSupervisorChat,
  getMessagesSupervisorChat
};