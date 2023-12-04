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

router.use('/:id/likes', likeRouter);
router.use('/:id/retweets', retweetRouter);
router.use('/:id/comments', commentRouter);
router.use('/:id/bookmarks', bookmarkRouter);

// prettier-ignore
router.route('/')
  .get(getTweets)
  .post(protect, createTweet);

// prettier-ignore
router.route('/:id')
  .patch(protect, checkOwnership(Tweet), updateTweet)
  .delete(protect, checkOwnership(Tweet), deleteTweet)

module.exports = router;
