const mongoose = require('mongoose');

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
}, { timestamps: true }); // enables automatic createdAt and updatedAt fields

module.exports = mongoose.model('Message', MessageSchema);
