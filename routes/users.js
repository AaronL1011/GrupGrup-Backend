const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const verify = require('../utils/verify-token');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/user', verify, async (req, res) => {
  try {
    await User.findById(req.user)
      .then((user) => {
        res.status(400).json({
          username: user.username,
          id: user._id,
          url: user.profile_url
        });
      })
      .catch((err) =>
        res.send(400).send('User not found, please check and try again.')
      );
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    await User.find()
      .then((users) => {
        return res.status(200).send(users);
      })
      .catch(() => {
        return res
          .status(400)
          .send('Users not found, please check and try again');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Get user profile
router.get('/profile/:profileUrl', async (req, res) => {
  try {
    await User.findOne({ profile_url: req.params.profileUrl })
      .then(async (user) => {
        if (!user) {
          return res
            .status(400)
            .send('User doesnt exist, please check url and try again.');
        } else {
          return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profile_picture,
            bio: user.bio,
            posts: user.posts
          });
        }
      })
      .catch(() => {
        return res
          .status(400)
          .send('User doesnt exist, please check and try again');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Get user posts
router.get('/:id/posts', async (req, res) => {
  try {
    await User.findById(req.params.id)
      .then(async (user) => {
        const userPosts = [];
        for (i = 0; i < user.posts.length; i++) {
          const post = await Post.findById(user.posts[i]);
          if (post) {
            userPosts.push(post);
          }
        }
        return res.status(200).send(userPosts);
      })
      .catch(() => {
        return res
          .status(404)
          .send('User doesnt exist, please check and try again');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Get a user by id
router.get('/:id', async (req, res) => {
  try {
    await User.findById(req.params.id)
      .then((user) => {
        return res.status(200).send(user);
      })
      .catch(() => {
        return res
          .status(404)
          .send('User doesnt exist, please check and try again');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Update user information - PRIVATE ROUTE
router.put('/update', verify, async (req, res) => {
  try {
    const emailAlreadyExists = await User.findOne({ email: req.body.email });
    if (emailAlreadyExists) {
      return res.status(400).send('A user with this email already exists');
    }

    await User.findByIdAndUpdate(req.user, req.body, { new: true })
      .then((user) => {
        return res.status(200).send(user);
      })
      .catch(() => {
        return res
          .status(404)
          .send('User not found, please check and try again');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Delete a user by their ID - PRIVATE ROUTE
router.delete('/delete', verify, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    return res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify if a token is valid
router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
