const WebSocket = require('ws');
const Conversation = require('../models/Conversation');

// Create a map to store all connections
const connections = new Map();

// Create a new WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

let newMessageSupervisorChat = async (conversationId, content, sender) => {
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
  // Find the user associated with the connection and delete it
  for(let [conversationId, websocket] of connections.entries()) {
    if(ws === websocket) {
      connections.delete(conversationId);
      break;
    }
  }
};


let broadcastMessage = (conversationId, message) => {
  // Find the user's connection
  const ws = connections.get(conversationId);

  // If the connection exists and is open, send the message
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
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

  // Store this connection
  connections.set(conversationId, ws);

  ws.on('message', async (message) => {
    const { content, sender } = JSON.parse(message);
    await newMessageSupervisorChat(conversationId, content, sender);

    // Now, broadcast the message to the user
    broadcastMessage(conversationId, { sender, content });
  });

  ws.on('close', () => {
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    handleError(error);
  });
});

module.exports = {
  wss,
};