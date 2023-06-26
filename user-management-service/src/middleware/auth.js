// middlewares/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Set this as an environment variable in production
const SECRET_KEY = 'your_secret_key';

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const data = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Not authorized to access this resource');
    res.status(401).send({ error: 'Not authorized to access this resource' });
  }
};

module.exports = auth;
