const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
}, { timestamps: true });


const ConversationSchema = new Schema({
  messages: [MessageSchema],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  supervisorId: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
