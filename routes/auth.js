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

  const userAlreadyExists = await User.findOne({ email: req.body.email });
  if (userAlreadyExists) {
    return res.status(400).send('A user with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({ token });
  } catch (error) {
    res.status(400).send(error);
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
    return res.status(400).send('Invalid Password');
  }

  // Create and assign JWT
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).json({ token });
});

module.exports = router;
