const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema({
  messages: [MessageSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
