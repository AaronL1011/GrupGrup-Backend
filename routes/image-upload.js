const express = require('express');
const router = express.Router();
const upload = require('../utils/file-upload');

const imageUpload = upload.array('images', 4);

router.post('/image-upload', function (req, res) {
  imageUpload(req, res, (error) => {
    if (error) {
      return res.status(422).send({
        errors: [{ title: 'Invalid File Type', detail: error.message }]
      });
    }
    const urls = req.files.map((file) => file.location);
    return res.json(urls);
  });
});

module.exports = router;
