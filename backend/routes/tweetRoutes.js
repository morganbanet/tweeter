const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweetModel');
const commentRouter = require('./commentRoutes');
const likeRouter = require('./likeRoutes');
const retweetRouter = require('./retweetRoutes');
const bookmarkRouter = require('./bookmarkRoutes');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getTweets,
  createTweet,
  updateTweet,
  deleteTweet,
} = require('../controllers/tweetController');

router.use('/:tweetId/likes', likeRouter);
router.use('/:tweetId/retweets', retweetRouter);
router.use('/:tweetId/comments', commentRouter);
router.use('/:tweetId/bookmarks', bookmarkRouter);

// prettier-ignore
router.route('/')
  .get(getTweets)
  .post(protect, createTweet);

// prettier-ignore
router.route('/:id')
  .patch(protect, checkOwnership(Tweet), updateTweet)
  .delete(protect, checkOwnership(Tweet), deleteTweet)

module.exports = router;
