const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');
const { uploadFile, deleteFile } = require('../utils/storageBucket');

// @desc        Get comments for a tweet
// @route       GET /api/tweets/:tweetId/comments
// @access      Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const altQuery = { tweet: req.params.tweetId };

  const result = await advancedResults(req, Comment, altQuery);
  const { pagination, results: comments } = result;

  res.status(200).json({
    success: true,
    count: comments.length,
    pagination,
    data: comments,
  });
});

// @desc        Create comment
// @route       POST /api/tweets/:tweetId/comments
// @access      Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.tweet = req.params.tweetId;
  req.body.user = req.user.id;

  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  // Set comment privacy same as parent tweet
  req.body.private = tweet.private;

  const comment = await Comment.create(req.body);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, comment, 'image', 'comments');
  }

  res.status(201).json({ success: true, data: comment });
});

// @desc        Update comment
// @route       PATCH /api/comments/:id
// @access      Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    text: req.body.text,
  };

  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id ${req.params.id}`, 404)
    );
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, comment, 'image', 'comments');
  }

  res.status(200).json({ success: true, data: comment });
});

// @desc        Delete comment
// @route       DELETE /api/comments/:id
// @access      Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id ${req.params.id}`, 404)
    );
  }

  await deleteFile(comment, 'image', false);

  await comment.deleteOne();

  // @Todo: Delete all associated likes

  res.status(200).json({ success: true, data: {} });
});
