const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User ', userSchema);

module.exports = User;