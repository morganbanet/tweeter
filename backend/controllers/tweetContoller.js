const Tweet = require('../models/tweetModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { uploadFile } = require('../utils/storageBucket');

// @desc        Get All Tweets
// @route       GET /api/tweets
// @access      Public
exports.getTweets = asyncHandler(async (req, res, next) => {
  const tweets = await Tweet.find({});

  res.status(200).json({ success: true, count: tweets.length, data: tweets });
});

// @desc        Create Tweet
// @route       POST /api/tweets
// @access      Private
exports.createTweet = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const tweet = await Tweet.create(req.body);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, tweet, 'image', 'tweets');
  }

  res.status(201).json({ success: true, data: tweet });
});

// @desc        Edit Tweet
// @route       PATCH /api/tweets
// @access      Private

// @desc        Delete Tweet
// @route       DELETE /api/tweets/create
// @access      Private
