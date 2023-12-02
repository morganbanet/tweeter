const Like = require('../models/likeModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get tweet likes
// @route       GET /api/tweets/:tweetId/likes
// @access      Public
exports.getTweetLikes = asyncHandler(async (req, res, next) => {
  const likes = await Like.find({ liked: req.params.tweetId }).populate('user');

  res.status(200).json({ success: true, count: likes.length, data: likes });
});

// @desc        Like tweet
// @route       POST /api/tweets/:tweetId/likes
// @access      Private
exports.likeTweet = asyncHandler(async (req, res, next) => {
  const likeToCreate = {
    user: req.user.id,
    liked: req.params.tweetId,
    likedType: 'Tweet',
  };

  const likeExists = await Like.find(likeToCreate);

  if (likeExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} already liked tweet ${req.params.tweetId}`,
        400
      )
    );
  }

  const like = await Like.create(likeToCreate);

  res.status(201).json({ success: true, data: like });
});

// @desc        Unlike tweet
// @route       DELETE /api/tweets/:tweetId/likes/:id
// @access      Private
exports.unlikeTweet = asyncHandler(async (req, res, next) => {
  const like = await Like.findById(req.params.id);

  if (!like) {
    return next(
      new ErrorResponse(`Like not found with id ${req.params.id}`, 404)
    );
  }

  await like.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc        Get comment likes
// @route       GET /api/comments/:commentId/likes
// @access      Public

// @desc        Like comment
// @route       POST /api/comments/:commentId/likes/:id
// @access      Private

// @desc        Unlike comment
// @route       DELETE /api/comments/:commentId/likes/:id
// @access      Private
