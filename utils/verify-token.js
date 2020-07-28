const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  try {
    const token = req.header('auth-token');
    if (!token)
      return res.status(401).json({ msg: 'No auth token, access denied.' });

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!verified)
      return res
        .status(401)
        .json({ msg: 'Token verification failed, authorization denied.' });

    req.user = verified._id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
