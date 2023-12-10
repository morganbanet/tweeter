const User = require('../models/userModel');
const Tweet = require('../models/tweetModel');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');
const Retweet = require('../models/retweetModel');
const Bookmark = require('../models/bookmarkModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');

// Pass in queries for getting tweets by user, comments by user, etc?

// @desc        Get all users
// @route       GET /api/users
// @access      Public
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const result = await advancedResults(req, User);
  const { pagination, results: users } = result;

  res
    .status(200)
    .json({ success: true, count: users.length, pagination, data: users });
});

// @desc        Get single user
// @route       GET /api/users/:id
// @access      Public
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc        Get tweets by user
// @route       GET /api/users/:id/tweets
// @access      Public
exports.getUserTweets = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { user: req.params.id },
  };

  const result = await advancedResults(req, Tweet, options);
  const { pagination, results: tweets } = result;

  res
    .status(200)
    .json({ success: true, count: tweets.length, pagination, data: tweets });
});

// @desc        Get comments by user
// @route       GET /api/users/:id/comments
// @access      Public
exports.getUserComments = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { user: req.params.id },
  };

  const result = await advancedResults(req, Comment, options);
  const { pagination, results: comments } = result;

  res.status(200).json({
    success: true,
    count: comments.length,
    pagination,
    data: comments,
  });
});

// @desc        Get likes by user
// @route       GET /api/users/:id/likes
// @access      Public
exports.getUserLikes = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { user: req.params.id },
  };

  const result = await advancedResults(req, Like, options);
  const { pagination, results: likes } = result;

  res.status(200).json({
    success: true,
    count: likes.length,
    pagination,
    data: likes,
  });
});

// @desc        Get retweets by user
// @route       GET /api/users/:id/retweets
// @access      Public
exports.getUserRetweets = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { user: req.params.id },
  };

  const result = await advancedResults(req, Retweet, options);
  const { pagination, results: retweets } = result;

  res.status(200).json({
    success: true,
    count: retweets.length,
    pagination,
    data: retweets,
  });
});

// @desc        Get Current User Bookmarks
// @route       GET /api/users/bookmarks
// @access      Private
exports.getUserBookmarks = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { user: req.user.id },
  };

  const result = await advancedResults(req, Bookmark, options);
  const { pagination, results: bookmarks } = result;

  res.status(200).json({
    success: true,
    count: bookmarks.length,
    pagination,
    data: bookmarks,
  });
});
