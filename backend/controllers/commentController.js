const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const { uploadFile, deleteFile } = require('../utils/storageBucket');

// @desc        Get comments for a tweet
// @route       GET /api/tweets/:id/comments
// @access      Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ tweet: req.params.tweetId });

  res
    .status(200)
    .json({ success: true, count: comments.length, data: comments });
});

// @desc        Create comment
// @route       POST /api/tweets/:id/comments
// @access      Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.tweet = req.params.tweetId;
  req.body.user = req.user.id;

  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`)
    );
  }

  // Set comment privacy same as parent tweet
  req.body.public = tweet.public;

  const comment = await Comment.create(req.body);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, comment, 'image', 'comments');
  }

  res.status(201).json({ success: true, data: comment });
});

// @desc        Update comment
// @route       PATCH /api/tweets/:id/comments
// @access      Private

// @desc        Delete comment
// @route       DELETE /api/tweets/:id/comments
// @access      Private

// @desc        Add like
// @route       POST /api/tweets
// @access      Private

// @desc        Delete like
// @route       DELETE /api/tweets
// @access      Private
