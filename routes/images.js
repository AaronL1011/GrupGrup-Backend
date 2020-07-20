const router = require('express').Router();
const Image = require('../models/Image');
const verify = require('../utils/verify-token');

// Create new Image
router.post('/', verify, async (req, res) => {
  try {
    const image = new Image({
      url: req.body.url,
      tags: req.body.tags,
      posts: req.body.posts,
      visibility: req.body.visibility
    });

    await image
      .save()
      .then((image) => {
        return res.status(200).send(image);
      })
      .catch((error) => {
        return res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all images
router.get('/', async (req, res) => {
  try {
    await Image.find()
      .then((images) => {
        return res.status(200).send(images);
      })
      .catch(() => {
        res.status(400).send('Images not found, please check and try again');
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Get image by ID
router.get('/:id', async (req, res) => {
  try {
    await Image.findById(req.params.id)
      .then((image) => {
        res.status(200).send(image);
      })
      .catch(() => {
        res
          .status(400)
          .send('This image doesnt exist, please check and try again');
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Update image by ID
router.put('/:id', verify, async (req, res) => {
  try {
    await Image.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((image) => {
        return res.status(200).json(image);
      })
      .catch(() => {
        return res
          .status(400)
          .send('This image doesnt exist, please check and try again.');
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Delete image by ID
router.delete('/:id', verify, async (req, res) => {
  try {
    await Image.findByIdAndRemove(req.params.id)
      .then((image) => {
        const response = {
          message: 'Image successfully deleted',
          id: image._id
        };

        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
