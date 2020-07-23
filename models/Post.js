const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  caption: {
    type: String
  },
  tags: {
    type: [String]
  },
  images: {
    type: [String],
    required: true
  },
  visibility: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Posts', PostSchema);
