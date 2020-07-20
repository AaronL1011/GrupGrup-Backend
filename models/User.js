const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_picture: {
    type: String
  },
  posts: {
    type: [String]
  }
});

module.exports = mongoose.model('Users', UserSchema);
