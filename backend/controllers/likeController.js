const Like = require('../models/likeModel');
const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');

// @desc        Get likes for a tweet or comment
// @route       GET /api/tweets/:tweetId/likes
// @route       GET /api/comments/:commentId/likes
// @access      Public
exports.getLikes = asyncHandler(async (req, res, next) => {
  let options = {
    altQuery: {},
    populate: 'user',
  };

  if (req.params.tweetId) {
    options.altQuery = { liked: req.params.tweetId };
  }

  if (req.params.commentId) {
    options.altQuery = { liked: req.params.commentId };
  }

  const result = await advancedResults(req, Like, options);
  const { pagination, results: likes } = result;

  res
    .status(200)
    .json({ success: true, count: likes.length, pagination, data: likes });
});

// @desc        Add like
// @route       POST /api/tweets/:tweetId/likes
// @route       POST /api/comments/:commentId/likes
// @access      Private
exports.createLike = asyncHandler(async (req, res, next) => {
  const paramsId = req.params.tweetId || req.params.commentId;
  const type = req.params.tweetId ? 'Tweet' : 'Comment';

  const likeToCreate = {
    user: req.user.id,
    liked: paramsId,
    likedType: type,
  };

  // Check if resource to like exists
  let model;
  if (req.params.tweetId) model = await Tweet.findById(paramsId);
  if (req.params.commentId) model = await Comment.findById(paramsId);

  if (!model) {
    return next(
      new ErrorResponse(`${type} not found with id ${paramsId}`, 404)
    );
  }

  const likeExists = await Like.find(likeToCreate);

  if (likeExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} already liked ${type.toLowerCase()} ${paramsId}`,
        400
      )
    );
  }

  const like = await Like.create(likeToCreate);

  res.status(201).json({ success: true, data: like });
});

// @desc        Remove like
// @route       DELETE /api/likes/:id
// @access      Private
exports.deleteLike = asyncHandler(async (req, res, next) => {
  const like = await Like.findById(req.params.id);

  if (!like) {
    return next(
      new ErrorResponse(`Like not found with id ${req.params.id}`, 404)
    );
  }

  await like.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
