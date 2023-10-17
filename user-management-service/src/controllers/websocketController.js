const WebSocket = require('ws');
const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = '123456789';



const conversationWebsockets = new Map();

// Create a new WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

let newMessage = async (conversationId, content, sender) => {
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
        recipient: 'Assistant'
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

let broadcastMessage = (conversationId, content, sender, senderName, receiver) => {
  console.log(`# broadcasting > conversationId: ${conversationId}, content: ${content}, sender: ${sender}, receiver: ${receiver}`);

  let thisConversationWebsocketMap = conversationWebsockets.get(conversationId);
  let ws = thisConversationWebsocketMap.get(receiver).get("ws");
  if (ws.readyState === WebSocket.OPEN) {
    logger.info('ws.readyState === WebSocket.OPEN => Will broadcast the message')
    ws.send(JSON.stringify({
      conversationId,
      content,
      sender,
      senderName,
      receiver,
    }));
  } 
};


// Handle errors on the websocket connection
let handleError = (error) => {
    console.log('handleError')

    // Log the error, send an error message to connected users, or perform other error-handling tasks.
};

wss.on('connection', (ws, req) => {
  logger.info('websocketController.js, New WebSocket connection request is received');
  const request_url = new URL(req.url, `http://${req.headers.host}`);
  let conversationId = request_url.searchParams.get('conversationId');
  let senderId = request_url.searchParams.get('senderId');
  let senderName = request_url.searchParams.get('senderName');

  
  // Store the conversation we bsocket in for the in conversationWebSockets if it does not already exist (for the specific userId)
  if (!conversationWebsockets.has(conversationId)) {
    let thisConversationWebsocketMap = new Map();
    let thisSenderIdMap = new Map();
    thisSenderIdMap.set("ws", ws);
    thisSenderIdMap.set("token", null);
    thisConversationWebsocketMap.set(senderId, thisSenderIdMap);
    conversationWebsockets.set(conversationId, thisConversationWebsocketMap); 
  } else {
    let thisConversationWebsocketMap = conversationWebsockets.get(conversationId);
    let thisSenderIdMap = new Map();
    thisSenderIdMap.set("ws", ws);
    thisSenderIdMap.set("token", null);
    thisConversationWebsocketMap.set(senderId, thisSenderIdMap);
    conversationWebsockets.set(conversationId, thisConversationWebsocketMap);
  }


  ws.on('message', async (message) => {
    // First check if the token of the conversationId for a given sender is null; 
    // If null, it means they are sending their first message, and the content of the 
    // message is the token. So, we need to authenticate the token at this point
    // If the token is not null, it means that the user has already authenticated, and 
    // don't even need to check the token. So, we can just continue with the message
    console.log('> Just received a message;')
    let thisConversationWebsocketMap = conversationWebsockets.get(conversationId);
    let thisSenderIdMap = thisConversationWebsocketMap.get(senderId);

    if (thisSenderIdMap.get("token") === null) {
      const claimed_token = JSON.parse(message)['token'];
      
      try {
        const data = jwt.verify(claimed_token, SECRET_KEY);
        const user = await User.findOne({ _id: data.user.id, 'tokens.token': claimed_token });
        if (!user) {
          throw new Error();
        }
        if (user._id.toString() !== senderId.toString()) {
          throw new Error();
        }
        thisSenderIdMap.set("token", claimed_token);
        thisConversationWebsocketMap.set(senderId, thisSenderIdMap);
        conversationWebsockets.set(conversationId, thisConversationWebsocketMap);
      } catch (error) {
        console.log("The actual error is: ", error);
        logger.error('Not authorized to access this resource');
        // close the websocket connection
        conversationWebsockets.delete(conversationId);
        ws.close();
      }

    } else {
      // Let's assume the user is already authorized and authenticated
      // We set the client-server (and vice versa) standard for message as content, sender, receiver
      const { conversationId, content } = JSON.parse(message);

      // Let's find the receiver, the receiver is the one user in conversationWebsockets that is not the sender
      // If that user does not yet exist, it means the supervisor/receiver has not yet joined the conversation,
      // in which case, we only need to save the message to the database, and not broadcast it
      let thisConversationWebsocketMap = conversationWebsockets.get(conversationId);
      //let thisSenderIdMap = thisConversationWebsocketMap.get(senderId);
      let sender = senderId;
      let receiver = null;
      for (let [user, ws] of thisConversationWebsocketMap.entries()) {
        console.log(`Trying this user: ${user} and senderId is: ${senderId}`)
        if (user !== senderId) {
          receiver = user;
          break;
        }
      }
      /*
      console.log('Sender is: ', sender);
      console.log('Receiver is: ', receiver);
      console.log('thisConversationWebsocketMap is: ', thisConversationWebsocketMap);
      console.log('thisSenderIdMap is: ', thisSenderIdMap);
      console.log('thisSenderIdMap.get("token") is: ', thisSenderIdMap.get("token"));
      console.log('thisSenderIdMap.get("ws") is: ', thisSenderIdMap.get("ws"));
      console.log('thisConversationWebsocketMap.get(senderId) is: ', thisConversationWebsocketMap.get(senderId));
      if (receiver !== null) {
        console.log('thisConversationWebsocketMap.get(receiver) is: ', thisConversationWebsocketMap.get(receiver));
        console.log('thisConversationWebsocketMap.get(receiver).get("ws") is: ', thisConversationWebsocketMap.get(receiver).get("ws"));
        console.log('thisConversationWebsocketMap.get(receiver).get("token") is: ', thisConversationWebsocketMap.get(receiver).get("token"));
      }
      */

      await newMessage(conversationId, content, senderId);
      console.log(`The receiver is ${receiver}`);
      if (receiver !== null) {
        // Now, broadcast the message
        broadcastMessage(conversationId, content, sender, senderName, receiver);
      }
      
    }
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