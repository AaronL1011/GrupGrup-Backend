const router = require('express').Router();
const Tag = require('../models/Tag');
const verify = require('../utils/verify-token');

// Create new Tag
router.post('/', verify, async (req, res) => {
  try {
    const tags = await Tag.find({ tag: req.body.tag.toLowerCase() });
    let tagExists = tags.length > 0;
    if (tagExists) {
      return res
        .status(400)
        .send('Tag already exists, please choose another name');
    }
    const tag = new Tag({
      tag: req.body.tag.toLowerCase(),
      posts: req.body.posts,
      images: req.body.images
    });

    await tag.save().then((tag) => {
      return res.status(200).send(tag);
    });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Get all tags
router.get('/', async (req, res) => {
  try {
    await Tag.find()
      .then((tags) => {
        return res.status(200).send(tags);
      })
      .catch(() => {
        return res
          .status(400)
          .send('Tags dont exist, please check and try again.');
      });
  } catch (error) {
    return res.status(500).send('Something went wrong!');
  }
});

// Get tag by name
router.get('/:tagName', async (req, res) => {
  try {
    await Tag.find({ tag: req.params.tagName.toLowerCase() })
      .then((tag) => {
        if (tag.length > 0) {
          return res.status(200).send(tag[0]);
        } else {
          return res
            .status(400)
            .send('Tag doesnt exist, please check and try again');
        }
      })
      .catch(() => {
        return res
          .status(400)
          .send('Tag doesnt exist, please check and try again');
      });
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
});

// Update tag by name
router.put('/:tagName', verify, async (req, res) => {
  try {
    await Tag.find({
      tag: req.params.tagName.toLowerCase()
    })
      .then(async (tags) => {
        if (tags.length === 0) {
          return res
            .status(400)
            .send('Tag doesnt exist, please check and try again.');
        }
        await Tag.findByIdAndUpdate(tags[0]._id, req.body, { new: true })
          .then((tag) => {
            return res.status(200).send(tag);
          })
          .catch(() => {
            return res
              .status(400)
              .send('Tag doesnt exist, please check and try again.');
          });
      })
      .catch((error) => {
        return res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

// Delete tag by ID
router.delete('/:id', verify, async (req, res) => {
  try {
    await Tag.findByIdAndRemove(req.params.id)
      .then((tag) => {
        const response = {
          message: 'Tag successfully deleted',
          id: tag._id
        };

        return res.status(200).json(response);
      })
      .catch(() => {
        return res
          .status(400)
          .send('Tag doesnt exist, please check and try again.');
      });
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
