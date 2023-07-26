const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const path = require('path');
const Conversation = require('../models/Conversation');

// Set this as an environment variable in production
const SECRET_KEY = '123456789';

// Mapping from role to routes
let rolePermissions = {
  'supervisor': ['/chat/all-conversations', '/chat/', '/dashboard/'],
  'employee': ['/chat/', '/dashboard/']
}


// Reverse mapping from route to roles
let routesToRoles = {};
for (const role in rolePermissions) {
  rolePermissions[role].forEach(route => {
    if (!routesToRoles[route]) {
      routesToRoles[route] = [];
    }
    routesToRoles[route].push(role);
  });
}



// The most basic auth middleware checking if the user is logged in
const auth = async (req, res, next) => {
  //console.log('The request is: ', req);
  const authHeader = req.header('Authorization');
  //console.log('Auth header is ', authHeader)
  if (!authHeader) {
    logger.error('Not authorized to access this resource');
    return res.status(401).send({ error: 'Not authorized to access this resource' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    //console.log(">>>>>>>> This is token now:", token);
    //console.log(">>>>>>>> This is SECRET_KEY now: ", SECRET_KEY)
    //console.log("- - - - - - - - - - - - - - -  - - - - -")
    const data = jwt.verify(token, SECRET_KEY);
    //console.log("&&&&& Data is: ", data);
    //console.log('&&&&& Data.user.id: ', data.user.id)
    const user = await User.findOne({ _id: data.user.id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
  } catch (error) {
    console.log("The actual error is: ", error);
    logger.error('Not authorized to access this resource');
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
  next();
};


// Checking if the user role allows for accessing particular path or not
const roleAuth = async (req, res, next) => {
  // Printing the body of the function name of next:

  if (req.user === undefined) {
    logger.error('Not authorized to access this resource ...');
    return res.status(403).send({ error: 'Not authorized to access this resource' });
  }
  const userRole = req.user.role;
  const route = req.originalUrl;
  
  if (!routesToRoles[route] || !routesToRoles[route].includes(userRole)) {
    logger.error('Not authorized to access this resource ...');
    return res.status(403).send({ error: 'Not authorized to access this resource' });
  } else {
    next();
  }
};


// check if the exact conversation (with conversationId) has the same value for `userId` field as `currentUser._id`. 
// If not, throw an exception. 
// The following middleware is only useful for those that contain a conversationId in the path (e.g. /chat/:conversationId) to
// Expected outcome: If a user is not authorized to view a conversation in /chat/:conversationId, they should be blocked,
// Generally, this is aiming to block one user from viewing a conversation that belongs to another user.
const chatPathAuth = async (req, res, next) => {
  const user = req.user;
  const conversationId = req.params.conversationId;
    console.log('Conversation is: ', conversation);

  const conversation = await Conversation.findById(conversationId);
  
  console.log('Conversation is: ', conversation);
  if (conversation.userId.toString() !== user._id.toString()) {
    logger.error('Not authorized to access this chat');
    return res.status(403).send({ error: 'Not authorized to access this chat' });
  }
  
  next();
};


module.exports = { auth, roleAuth, chatPathAuth };