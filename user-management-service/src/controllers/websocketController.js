const WebSocket = require('ws');
const Conversation = require('../models/Conversation');


// Create a new WebSocket Server
const wss = new WebSocket.Server({ port: 3001 });


let newMessageSupervisorChat = async (conversationId, content, sender) => {
    console.log('newMessageSupervisorChat')
    try {
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return {
          error: 'Conversation not found',
        };
      }
      conversation.messages.push({
        sender,
        content: content,
        recipient: 'supervisor'
      });
  
      await conversation.save();
      return {
        message: 'Message sent successfully',
      };
    } catch (error) {
      return {
        error: 'There was a server error',
      };
    }
};


let handleDisconnect = (ws) => {
    console.log('handleDisconnect')

    // You might want to remove the user from any list of connected users here, or perform other clean-up tasks.
};

// Broadcast a message to all connected users
let broadcastMessage = (message) => {
    console.log('broadcastMessage')

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        }
    });
};

// Handle errors on the websocket connection
let handleError = (error) => {
    console.log('handleError')

    // Log the error, send an error message to connected users, or perform other error-handling tasks.
};

wss.on('connection', (ws, req) => {

    // Extract conversationId from URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const conversationId = url.searchParams.get('conversationId');
    
    ws.on('message', async (message) => {
      const { content, sender } = JSON.parse(message);
      await newMessageSupervisorChat(conversationId, content, sender);
    });
  
    ws.on('close', () => {
        // Handle closing connections here. You might want to clean up the saved ws connection for example.
        handleDisconnect(ws);
    });

    ws.on('error', (error) => {
        handleError(error);
    });
});


module.exports = {
    wss,
}