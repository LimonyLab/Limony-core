const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Set this as an environment variable in production
const SECRET_KEY = '123456789';


exports.register = async (req, res) => { 
  try {
    // Check if this user already exists
    User.findOne({ email: req.body.email })
      .then(async user => {
        if (user) {
          return res.status(400).json({ message: 'Email already exists' });
        } else {
          // Create and save the user
          user = new User(req.body);

          user.password = await bcrypt.hash(user.password, 10);
          logger.info(`Newly hashed password: ${await user.password}`)
          //user.save();
          await user.save();
          logger.info(`User registered: ${user.email}`);
          return res.status(201).json({ email: user.email, message: 'User registered successfully.' });
        }
      })
      .catch(err => {
        logger.error('Error while checking existing user:', err);
        return res.status(500).json({ message: 'Server error' });
      });
  } catch (err) {
    logger.error(err.message);
    return res.status(500).json({ message: 'Error registering user.' });  
  }
};




exports.login = async (req, res) => {
  logger.info('Received a req to the login api.')
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ msg: 'User Not Exist' });
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect Password!' });

    

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      SECRET_KEY,
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    logger.error(e.message);
    res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Request.user is getting fetched from Middleware after token authentication
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.json(user);
  } catch (e) {
    logger.error(e.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    // Request.user is getting fetched from Middleware after token authentication
    await User.findByIdAndDelete(req.user.id);
    res.json({ msg: 'User deleted' });
  } catch (e) {
    logger.error(e.message);
    res.status(500).send('Server Error');
  }
};
