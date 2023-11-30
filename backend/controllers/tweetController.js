const Tweet = require('../models/tweetModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { uploadFile, deleteFile } = require('../utils/storageBucket');

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

// @desc        Update Tweet
// @route       PATCH /api/tweets/:id
// @access      Private
exports.updateTweet = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    text: req.body.text,
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

// @desc        Delete Tweet
// @route       DELETE /api/tweets/:id
// @access      Private
exports.deleteTweet = asyncHandler(async (req, res, next) => {
  let tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.id}`, 404)
    );
  }

  await deleteFile(tweet, 'image');

  await tweet.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
