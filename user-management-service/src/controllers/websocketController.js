const WebSocket = require('ws');
const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');


const conversationWebsockets = new Map();

// Create a new WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

let newMessage = async (conversationId, content, sender, receiver) => {
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
  // Following should be updated heavily to use the current design 
  /*
  for(let [conversationId, websocket] of connections.entries()) {
    if(ws === websocket) {
      connections.delete(conversationId);
      break;
    }
  }
  */
};



let broadcastMessage = (conversationId, content, sender, receiver) => {
  console.log(`# broadcasting > conversationId: ${conversationId}, content: ${content}, sender: ${sender}, receiver: ${receiver}`);
  let thisConversationWebsocketMap = conversationWebsockets.get(conversationId);
  for (let [user, ws] of thisConversationWebsocketMap.entries()) {
    if (ws.readyState === WebSocket.OPEN && user !== sender && user === receiver) {
      logger.info('ws.readyState === WebSocket.OPEN && user !== sender && user === receiver => Will broadcast the message')
      ws.send(JSON.stringify({
        conversationId,
        content,
        sender,
        receiver,
      }));
    }
  } 

};

// Handle errors on the websocket connection
let handleError = (error) => {
    console.log('handleError')

    // Log the error, send an error message to connected users, or perform other error-handling tasks.
};

wss.on('connection', (ws, req) => {
  logger.info('websocketController.js, New WebSocket connection request is received');
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sender = url.searchParams.get('sender');
  const receiver = url.searchParams.get('receiver');

  // if receiver was empty string abort (this was a temporary fix, the problem is resolved now...)
  if (receiver === '""') {
    console.log('! receiver is empty string, aborting...')
    ws.close();
    return;
  } 

  const conversationId = url.searchParams.get('conversationId');

  // Store the conversation websocket in for the in conversationWebSockets if it does not already exist (for the specific userId)
  if (!conversationWebsockets.has(conversationId)) {

    let thisConversationWebsocketMap = new Map();
    thisConversationWebsocketMap.set(sender, ws);
    conversationWebsockets.set(conversationId, thisConversationWebsocketMap); 
  } else {
    let thisConversationWebsocketMap = conversationWebsockets.get(conversationId);
    thisConversationWebsocketMap.set(sender, ws);
    conversationWebsockets.set(conversationId, thisConversationWebsocketMap);
  }


  ws.on('message', async (message) => {
    // We set the client-server (and vice versa) standard for message as content, sender, receiver
    const { conversationId, content, sender, receiver } = JSON.parse(message);
    console.log(`# New message received > conversationId: ${conversationId}, content: ${content}, sender: ${sender}, receiver: ${receiver}`);

    

    // Also, what are we doing with the first argument of newMessage?
    await newMessage(conversationId, content, sender, receiver);

    // Now, broadcast the message
    broadcastMessage(conversationId, content, sender, receiver);
  });


  ws.on('close', () => {
    ws.close();
    // handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    handleError(error);
  });
});

module.exports = {
  wss,
};