const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'employee' }, 
  conversationId: { type: String },
  profile: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    // ...
  },
  healthInfo: {
    bloodPressure: {
      systolic: { type: Number },
      diastolic: { type: Number },
    },
    overallHealthStatus: { type: String },
    // ...
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
