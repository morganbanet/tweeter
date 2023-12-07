const Tweet = require('../models/tweetModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');
const unionCollections = require('../utils/unionCollections');
const { createHashtags } = require('../utils/hashtagHelper');
const { uploadFile, deleteFile } = require('../utils/storageBucket');

// @desc        Get all tweets
// @route       GET /api/tweets
// @access      Public
exports.getTweets = asyncHandler(async (req, res, next) => {
  const options = {
    aggregate: unionCollections('retweets', 'retweeted', 'tweets'),
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

  // @Todo: Update hashtag docs & count when updating/deleting tweets

  let tweet = await Tweet.create(tweetToCreate);

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

  await deleteFile(tweet, 'image', false);

  await tweet.deleteOne();

  // @Todo: Delete user tweets and all associated tweets data:
  // Comment likes
  // Delete comment bucket files
  // Delete comments
  // Tweet likes
  // Retweets
  // Bookmarks
  // Delete tweet bucket files
  // Tweet

  res.status(200).json({ success: true, data: {} });
});
