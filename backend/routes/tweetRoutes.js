const express = require('express');
const router = express.Router();

const { getTweets, createTweet } = require('../controllers/tweetContoller');

const { protect, checkOwnership } = require('../middleware/authMiddleware');

router.route('/').get(getTweets).post(protect, createTweet);

module.exports = router;
