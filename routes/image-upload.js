const express = require('express');
const router = express.Router();
const upload = require('../utils/file-upload');
const verify = require('../utils/verify-token');
const Post = require('../models/Post');
const User = require('../models/User');

const imageUploadMulti = upload.array('images', 4);
const imageUploadSingle = upload.single('image');

router.post('/image-upload', verify, async function (req, res) {
  try {
    await imageUploadMulti(req, res, async (error) => {
      if (error) {
        return res.status(422).send({
          errors: [{ title: 'Invalid File Type', detail: error.message }]
        });
      }
      const urls = req.files.map((file) => file.location);
      const post = new Post({
        displayName: req.body.displayName,
        authorID: req.body.authorID,
        images: urls,
        caption: req.body.caption,
        tags: req.body.tags.toLowerCase().replace(/\s+/g, '').split(','),
        visibility: req.body.visibility
      });

      const current_user = await User.findById(req.user);
      await post
        .save()
        .then(async (post) => {
          await current_user.updateOne({
            posts: [post._id, ...current_user.posts]
          });
          return post;
        })
        .then((post) => {
          res.status(200).send(post);
        })
        .catch((error) => {
          return res
            .status(400)
            .json({ error: error.errors.images.properties.message });
        });
    });
  } catch (error) {
    res.status(500).send('Internal Server Error.');
  }
});

router.post('/profile-pic-upload', verify, async function (req, res) {
  try {
    await imageUploadSingle(req, res, async (error) => {
      if (error) {
        return res.status(422).send({
          errors: [{ title: 'Invalid File Type', detail: error.message }]
        });
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
          res.status(400).send(error);
        });
    });
  } catch (error) {
    res.status(500).send('Internal Server Error.');
  }
});

module.exports = router;
