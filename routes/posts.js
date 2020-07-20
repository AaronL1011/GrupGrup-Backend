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
          .send('Posts dont exist, please check and try again.');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
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
          .status(404)
          .send('This post doesnt exist, please check and try again.');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Create a post - PRIVATE ROUTE
router.post('/', verify, async (req, res) => {
  const post = new Post({
    images: req.body.images,
    caption: req.body.caption,
    tags: req.body.tags
  });

  try {
    const current_user = await User.findById(req.user._id);

    await post
      .save()
      .then((post) => {
        current_user.updateOne({ posts: [post._id, ...current_user.posts] });
        return post;
      })
      .then((post) => {
        res.status(200).send(post);
      })
      .catch((error) => {
        return res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Update post information - PRIVATE ROUTE
router.put('/:id', verify, async (req, res) => {
  const current_user = await User.findById(req.user._id);

  if (current_user.posts.includes(req.params.id)) {
    try {
      await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((post) => {
          return res.status(200).json(post);
        })
        .catch((error) => {
          return res.status(400).send(error.message);
        });
    } catch (error) {
      return res.status(500).send('Internal server error.');
    }
  } else {
    return res.status(401).send('Unauthorized.');
  }
});

// Delete a post - PRIVATE ROUTE
router.delete('/:id', verify, async (req, res) => {
  const current_user = await User.findById(req.user._id);

  if (current_user.posts.includes(req.params.id)) {
    try {
      await Post.findByIdAndRemove(req.params.id)
        .then((post) => {
          const response = {
            message: 'Post successfully deleted',
            id: post._id
          };

          return res.status(200).json(response);
        })
        .catch(() => {
          return res
            .status(404)
            .send('This post doesnt exist, please check and try again.');
        });
    } catch (error) {
      res.status(500).send('Internal server error.');
    }
  } else {
    return res
      .status(401)
      .send('Either you are not authorized, or this post doesnt exist.');
  }
});

module.exports = router;
