const Like = require('../models/likeModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get tweet likes
// @route       GET /api/tweets/:id/likes
// @route       GET /api/comments/:id/likes
// @access      Public
exports.getLikes = asyncHandler(async (req, res, next) => {
  let likes;

  if (req.params.tweetId) {
    likes = await Like.find({ liked: req.params.tweetId }).populate('user');
  }

  if (req.params.commentId) {
    likes = await Like.find({ liked: req.params.commentId }).populate('user');
  }

  res.status(200).json({ success: true, count: likes.length, data: likes });
});

// @desc        Add like
// @route       POST /api/tweets/:id/likes
// @route       POST /api/comments/:id/likes
// @access      Private
exports.createLike = asyncHandler(async (req, res, next) => {
  const paramsId = req.params.tweetId || req.params.commentId;
  const type = req.params.tweetId ? 'Tweet' : 'Comment';

  const likeToCreate = {
    user: req.user.id,
    liked: paramsId,
    likedType: type,
  };

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
