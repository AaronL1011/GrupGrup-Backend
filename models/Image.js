const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  },
  posts: {
    type: [String]
  },
  visibility: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Images', ImageSchema);
