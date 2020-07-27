const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  authorID: {
    type: String,
    required: true
  },
  authorURL: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  tags: {
    type: [String]
  },
  images: {
    type: [String],
    validate: [arrayMinSize, 'You need at least 1 image to post!']
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

function arrayMinSize(imageArray) {
  return imageArray.length > 0;
}

module.exports = mongoose.model('Posts', PostSchema);
