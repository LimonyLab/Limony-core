const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const auth = require('./middleware/auth'); // import auth middleware
const logger = require('./utils/logger');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // use cors middleware

// MongoDB connection
mongoose.connect('mongodb://admin:123456789@localhost:27017/user-management?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () { 
  console.log('MongoDB connected');
});

app.use(express.json()); // for parsing application/json

app.post('/users/register', userController.register);
app.post('/users/login', userController.login);
app.get('/users/profile', auth, userController.getProfile); // protected route
app.put('/users/profile', auth, userController.updateProfile); // protected route
app.delete('/users/profile', auth, userController.deleteProfile); // protected route

app.listen(port, () => {
  console.log(`User Management Service listening at http://localhost:${port}`);
});
