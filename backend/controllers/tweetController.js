const Tweet = require('../models/tweetModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');
const tweetsAndRetweets = require('../utils/tweetsAndRetweets');
const { uploadFile } = require('../utils/storageBucket');
const { createHashtags, removeHashtags } = require('../utils/hashtagHelper');

// @desc        Get all tweets
// @route       GET /api/tweets
// @access      Public
exports.getTweets = asyncHandler(async (req, res, next) => {
  const options = {
    aggregate: tweetsAndRetweets(),
  };

  const result = await advancedResults(req, Tweet, options);
  const { pagination, results: tweets } = result;

  res
    .status(200)
    .json({ success: true, count: tweets.length, pagination, data: tweets });
});

// @desc        Create tweet
// @route       POST /api/tweets
// @access      Private
exports.createTweet = asyncHandler(async (req, res, next) => {
  const tweetToCreate = {
    user: req.user.id,
    text: req.body.text,
    private: req.body.private,
  };

  if (!req.body.text || req.body.text.trim() === '') {
    return next(new ErrorResponse(`Tweet must contain body text`, 400));
  }

  let tweet = await Tweet.create(tweetToCreate);

  // Create array of hashtags from req.body.text and process them
  const hashtags = tweetToCreate.text.match(/#\w+/g);
  if (hashtags) tweet = await createHashtags(hashtags, tweet);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, tweet, 'image', 'tweets');
  }

  res.status(201).json({ success: true, data: tweet });
});

// @desc        Update tweet
// @route       PATCH /api/tweets/:id
// @access      Private
exports.updateTweet = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    text: req.body.text,
    public: req.body.private,
  };

  let tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.id}`, 404)
    );
  }

  tweet = await Tweet.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

  // Remove existing hashtags and process any new ones
  tweet = await removeHashtags(tweet);
  const hashtags = fieldsToUpdate.text.match(/#\w+/g);
  if (hashtags) tweet = await createHashtags(hashtags, tweet);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, tweet, 'image', 'tweets');
  }

  res.status(200).json({ success: true, data: tweet });
});

// @desc        Delete tweet
// @route       DELETE /api/tweets/:id
// @access      Private
exports.deleteTweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.id}`, 404)
    );
  }

  await tweet.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
