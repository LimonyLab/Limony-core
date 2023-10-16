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
const https = require('https');
const fs = require('fs');
const { wss } = require('./controllers/websocketController');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/chat.limonylab.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/chat.limonylab.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/chat.limonylab.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};



const SECRET_KEY = '123456789';

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

// const server = http.createServer(app);
// Create an HTTPS server instead
const httpsServer = https.createServer(credentials, app);




server.on('upgrade', function upgrade(request, socket, head) {

  logger.info('index.js, server.on(upgrade)');

  const url = require('url');
  const pathname = url.parse(request.url).pathname;
  if (pathname === '/chat-socket') {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }

});


httpsServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

