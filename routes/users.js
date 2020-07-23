const router = require('express').Router();
const User = require('../models/User');
const verify = require('../utils/verify-token');

router.get('/user', verify, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    username: user.username,
    id: user._id
  });
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
          .status(404)
          .send('Users not found, please check and try again');
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
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
