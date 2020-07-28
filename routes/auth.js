const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// SIGN UP
const { signUpValidation, logInValidation } = require('../utils/form-validate');

router.post('/signup', async (req, res) => {
  const { error } = signUpValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailAlreadyExists = await User.findOne({ email: req.body.email });
  if (emailAlreadyExists) {
    return res.status(400).send('A user with this email already exists');
  }

  const profileURLAlreadyExists = await User.findOne({
    profile_url: req.body.profile_url.toLowerCase()
  });

  if (profileURLAlreadyExists) {
    return res.status(400).send('A user with this profile url already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    profile_url: req.body.profile_url.toLowerCase().replace(/\s+/g, ''),
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.TOKEN_SECRET);
    return res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        url: savedUser.profile_url
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

// LOG IN
router.post('/login', async (req, res) => {
  // Validate log in form data
  const { error } = logInValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(400)
      .send(
        'Some details were incorrect, please check email and password and try again.'
      );
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res
      .status(400)
      .send(
        'Some details were incorrect, please check email and password and try again.'
      );
  }
  try {
    // Create and assign JWT
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
    return res.json({
      token,
      user: {
        username: user.username,
        id: user._id,
        url: user.profile_url
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send('Something went wrong... Refresh and try again!');
  }
});

module.exports = router;
