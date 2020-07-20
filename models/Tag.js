const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
  tag: {
    type: String,
    required: true
  },
  posts: {
    type: [String],
    required: true
  },
  images: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Tags', TagSchema);
