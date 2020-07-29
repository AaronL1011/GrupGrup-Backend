const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const verify = require('../utils/verify-token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Get user info by token - PRIVATE ROUTE
router.get('/user', verify, async (req, res) => {
  try {
    await User.findById(req.user)
      .then((user) => {
        return res.status(200).json({
          username: user.username,
          id: user._id,
          url: user.profile_url
        });
      })
      .catch((err) => {
        return res.send(400).send('User not found, please check and try again');
      });
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
          .send('No users found, please check and try again');
      });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

// Get user profile
router.get('/profile/:profileUrl', async (req, res) => {
  try {
    await User.findOne({ profile_url: req.params.profileUrl })
      .then((user) => {
        return res.status(200).json({
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profile_picture,
          bio: user.bio,
          posts: user.posts
        });
      })
      .catch(() => {
        return res
          .status(400)
          .send('User doesnt exist, please check and try again');
      });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
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
          .status(400)
          .send('User doesnt exist, please check and try again');
      });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
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
          .status(400)
          .send('User doesnt exist, please check and try again');
      });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Update user information - PRIVATE ROUTE
router.put('/update', verify, async (req, res) => {
  try {
    const emailAlreadyExists = await User.findOne({ email: req.body.email });
    if (emailAlreadyExists && emailAlreadyExists.id !== req.user) {
      return res.status(400).send('A user with this email already exists');
    }

    const validEmail = emailIsValid(req.body.email);
    if (req.body.email === '' || !validEmail) {
      return res
        .status(400)
        .send('Please check that you entered a valid email!');
    }
    if (req.body.username === '') {
      return res
        .status(400)
        .send('Please check that you entered a valid username!');
    }

    await User.findByIdAndUpdate(req.user, req.body, { new: true })
      .then((user) => {
        return res.status(200).send(user);
      })
      .catch(() => {
        return res
          .status(400)
          .send('User not found, please check and try again');
      });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

function passwordIsValid(password) {
  return password.length > 6;
}

// Update user password - PRIVATE ROUTE
router.put('/update-password', verify, async (req, res) => {
  try {
    const validNewPassword = passwordIsValid(req.body.new_password);
    if (!validNewPassword) {
      return res
        .status(400)
        .send('Password must be a minimum of 6 characters!');
    }
    const user = await User.findById(req.user);

    const validPassword = await bcrypt.compare(
      req.body.current_password,
      user.password
    );

    if (validPassword) {
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(req.body.new_password, salt);
      user.password = newHashedPassword;
      await user.save().then((user) => {
        return res.status(200).send(user);
      });
    } else {
      return res
        .status(400)
        .send(
          'Some details were incorrect, please check password and try again.'
        );
    }
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

// Delete a user by their token - PRIVATE ROUTE
router.delete('/delete', verify, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user)
      .then(async (user) => {
        for (let post of user.posts) {
          await Post.findByIdAndDelete(post);
        }
        return res.status(200).send(user);
      })
      .catch(() => {
        return res
          .status(400)
          .send('User not found, please check and try again');
      });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

// Verify if a token is valid
router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('auth-token');
    if (!token) return res.status(400).json(false);

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verified) return res.status(400).json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.status(400).json(false);

    return res.status(200).send(true);
  } catch (error) {
    return res.status(400).send(false);
  }
});

module.exports = router;
