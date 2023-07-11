const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');
const auth = require('./middleware/auth'); // import auth middleware
const logger = require('./utils/logger');
const userRoutes = require('./routes/userRoutes'); // import user routes
const chatRoutes = require('./routes/chatRoutes'); // import chat routes
var cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http');
const { wss } = require('./controllers/chatController');

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
app.use('/users', userRoutes); // use user routes
app.use('/chat', chatRoutes); // use chat routes

const server = http.createServer(app);


// Bind the WebSocket server to the HTTP server.
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
