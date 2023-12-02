const express = require('express');
const router = express.Router({ mergeParams: true });
const Like = require('../models/likeModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getTweetLikes,
  likeTweet,
  unlikeTweet,
} = require('../controllers/likeController');

// prettier-ignore
router.route('/')
  .get(getTweetLikes)
  .post(protect, likeTweet)

// prettier-ignore
router.route('/:id')
  .delete(protect, checkOwnership(Like), unlikeTweet)

module.exports = router;
