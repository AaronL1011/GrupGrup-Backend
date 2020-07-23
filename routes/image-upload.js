const express = require('express');
const router = express.Router();
const upload = require('../utils/file-upload');
const verify = require('../utils/verify-token');
const Post = require('../models/Post');
const User = require('../models/User');

const imageUpload = upload.array('images', 4);

router.post('/image-upload', verify, async function (req, res) {
  try {
    await imageUpload(req, res, async (error) => {
      if (error) {
        return res.status(422).send({
          errors: [{ title: 'Invalid File Type', detail: error.message }]
        });
      }
      const urls = req.files.map((file) => file.location);
      const post = new Post({
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

module.exports = router;
