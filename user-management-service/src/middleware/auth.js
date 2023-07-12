const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Set this as an environment variable in production
const SECRET_KEY = '123456789';


/**
 * TODO: Role-based access control: Let's create add a functionality to the auth middleware so that there are multiple roles defined in
 * a certain mapping type. Each role in this file has access to a list of paths (type:string). Likewise, another practical mapping will
 * be created based on the previous mapping that maps paths to roles able to access them. Therefore, auth middleware checks each request path 
 * against the latter mapping to see which roles can access this path. If the role has access to this path there are two different 
 * possible outcomes: 1. Both the path and the actual resource are accessible by the exact user (like /dashboard/, that's accessible
 * by every logged-in user) 2. The role has access to the path, but, the exact user is not authorized to access to that exact resource (user 1 cannot
 *  access user 2's chat page via /chat/conversationId; or, 'employee' role-holding users cannot access /chat/supervisor-panel, ).     
 */

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
    next();
  } catch (error) {
    console.log("The actual error is: ", error);
    logger.error('Not authorized to access this resource');
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
};


module.exports = auth;
