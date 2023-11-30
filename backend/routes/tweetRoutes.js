const express = require('express');
const router = express.Router();

const {
  getTweets,
  createTweet,
  updateTweet,
  deleteTweet,
} = require('../controllers/tweetController');

const Tweet = require('../models/tweetModel');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

// prettier-ignore
router.route('/')
  .get(getTweets)
  .post(protect, createTweet);

// prettier-ignore
router.route('/:id')
  .patch(protect, checkOwnership(Tweet), updateTweet)
  .delete(protect, checkOwnership(Tweet), deleteTweet)

module.exports = router;
