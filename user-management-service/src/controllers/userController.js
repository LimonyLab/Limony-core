const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');
const axios = require('axios');


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

          try {
            await user.save();
            logger.info(`User registered: ${user.email}`);
          } catch (err) {
            logger.error('Error saving user:', err);
            return res.status(500).json({ message: 'Error saving user to the database.' });
          }

          console.log(29);
          // Create a new conversation when a user registers
          const conversation = new Conversation({
            messages: [],
            userId: user._id,
            supervisorId: null
          });
          await conversation.save();

          // Store the conversation ID in the user's document
          user.conversationId = conversation._id;





          const email = {
            from: 'LimonyAssistant@gmail.com',
            to: user.email,
            subject: 'Welcome to Our App!',
            html: `
              <p>Hello ${user.profile.name},</p>
              <p>Thank you for registering at our app.</p>
              <p>...</p>
            `,
          };


          // Send a welcome email to the newly created user. 
          axios.post('http://localhost:3002/enqueue-email', email)
            .then((response) => {
              console.log('Enqueued email: ', response.data);
            })
            .catch((error) => {
              console.error('Error enqueueing email: ', error);
            });


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
        expiresIn: '24h',
      },
      async (err, token) => {
        if (err) {
          logger.error("Error signing the token", err);
          return res.status(500).json({ message: 'Could not log in' });
        }

        // Store the token in the user's document
        user.tokens = user.tokens.concat({ token });
        await user.save();


        // Calculate the token expiry time
        const tokenExpiresIn = Math.floor(Date.now() / 1000) + (24 * 60 * 60);


        res.status(200).json({
          token,
          tokenExpiresIn,
          user: {
            id: user.id,
            email: user.email,
            name: user.profile.name,
            age: user.profile.age,
            registered: user.createdAt,
            role: user.role,
            conversationId: user.conversationId
            // add any other user properties you need here
          }
        });
      }
    );

  } catch (e) {
    logger.error(e.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send(error);
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

