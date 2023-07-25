const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  role: { type: String, default: 'employee' }, 
  conversationId: { type: String },
  profile: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    // Let's add more fields to here later
  },
  healthInfo: {
    bloodPressure: {
      systolic: { type: Number },
      diastolic: { type: Number },
    },
    overallHealthStatus: { type: String },
    // Let's add more fields to here later
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
