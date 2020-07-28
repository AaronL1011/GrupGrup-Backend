const router = require('express').Router();
const verify = require('../utils/verify-token');
const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts - PUBLIC ROUTE
router.get('/', async (req, res) => {
  try {
    await Post.find()
      .then((posts) => {
        return res.status(200).send(posts);
      })
      .catch(() => {
        return res
          .status(400)
          .send('No posts found, please check and try again.');
      });
  } catch (error) {
    res.status(500).send('Something went wrong... Refresh and try again!');
  }
});

// Get a post - PUBLIC ROUTE
router.get('/:id', async (req, res) => {
  try {
    await Post.findById(req.params.id)
      .then((post) => {
        return res.status(200).send(post);
      })
      .catch(() => {
        return res
          .status(400)
          .send('This post doesnt exist, please check and try again.');
      });
  } catch (error) {
    res.status(500).send('Something went wrong... Refresh and try again!');
  }
});

// Update post information - PRIVATE ROUTE
router.put('/:id', verify, async (req, res) => {
  const validPost = await Post.findById(req.params.id);

  if (validPost) {
    const current_user = await User.findById(req.user);

    if (current_user.posts.includes(req.params.id)) {
      try {
        await Post.findByIdAndUpdate(req.params.id, req.body, {
          new: true
        }).then((post) => {
          return res.status(200).json(post);
        });
      } catch (error) {
        return res
          .status(500)
          .send('Something went wrong... Refresh and try again!');
      }
    } else {
      return res.status(401).send('You are not authorized to edit this post.');
    }
  } else {
    return res
      .status(400)
      .send('Post doesnt exist, please check and try again.');
  }
});

// Delete a post - PRIVATE ROUTE
router.delete('/:id', verify, async (req, res) => {
  const current_user = await User.findById(req.user);

  if (current_user.posts.includes(req.params.id)) {
    try {
      await Post.findByIdAndRemove(req.params.id)
        .then(() => {
          return res.status(200).send('Post successfully deleted.');
        })
        .catch(() => {
          return res
            .status(404)
            .send('This post doesnt exist, please check and try again.');
        });
    } catch (error) {
      return res
        .status(500)
        .send('Something went wrong... Refresh and try again!');
    }
  } else {
    return res
      .status(401)
      .send('Either you are unauthorized, or this post doesnt exist.');
  }
});

module.exports = router;
