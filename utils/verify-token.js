const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  try {
    const token = req.header('auth-token');
    if (!token)
      return res
        .status(401)
        .send('Token verification failed, authorization denied.');

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verified)
      return res
        .status(401)
        .send('Token verification failed, authorization denied.');

    req.user = verified.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .send('Token verification failed, authorization denied.');
  }
};
