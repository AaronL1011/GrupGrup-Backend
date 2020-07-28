const express = require('express');
const router = express.Router();
const upload = require('../utils/file-upload');
const verify = require('../utils/verify-token');
const Post = require('../models/Post');
const User = require('../models/User');

const imageUploadMulti = upload.array('images', 4);
const imageUploadSingle = upload.single('image');

router.post('/api/image-upload', verify, async function (req, res) {
  try {
    await imageUploadMulti(req, res, async (error) => {
      if (error) {
        return res.status(422).send('Invalid file type, try another photo!');
      }

      const urls = req.files.map((file) => file.location);

      let tags = req.body.tags
        ? req.body.tags.toLowerCase().replace(/\s+/g, '').split(',')
        : req.body.tags;
      const post = new Post({
        displayName: req.body.displayName,
        authorID: req.body.authorID,
        authorURL: req.body.authorURL,
        images: urls,
        caption: req.body.caption,
        tags,
        visibility: req.body.visibility
      });

      const current_user = await User.findById(req.user);
      await post
        .save()
        .then(async (post) => {
          await current_user.updateOne({
            posts: [post._id, ...current_user.posts]
          });
          return res.status(200).send(post);
        })
        .catch((error) => {
          return res.status(400).send(error);
        });
    });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

router.post('/api/profile-pic-upload', verify, async function (req, res) {
  try {
    await imageUploadSingle(req, res, async (error) => {
      if (error) {
        return res.status(422).send('Invalid file type, try another photo!');
      }
      const updatedProfilePicture = {
        profile_picture: req.file.location
      };
      await User.findByIdAndUpdate(req.user, updatedProfilePicture, {
        new: true
      })
        .then((user) => {
          return res.status(200).send(user);
        })
        .catch((error) => {
          res.status(400).send('User not found, please check and try again');
        });
    });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

module.exports = router;
