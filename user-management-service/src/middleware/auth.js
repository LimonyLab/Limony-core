const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Set this as an environment variable in production
const SECRET_KEY = '123456789';


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
