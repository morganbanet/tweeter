const User = require('../models/userModel');
const Follow = require('../models/followModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @Todo: Combine into one using query via advancedResults.js
// @desc        Get all follows
// @route       GET /api/users/:userId/follows
// @access      Public

// @desc        Get user followers
// @route       GET /api/users/:userId/followers
// @access      Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const followers = await Follow.find({ following: req.user.id }).populate(
    'user'
  );

  res.status(200).json({ success: true, data: followers });
});

// @desc        Get user following
// @route       GET /api/users/:userId/follows
// @access      Public
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const following = await Follow.find({ user: req.params.userId }).populate(
    'following'
  );

  res.status(200).json({ success: true, data: following });
});

// @desc        Follow user
// @route       POST /api/users/:userId/follows
// @access      Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const followToCreate = {
    user: req.user.id,
    following: req.params.userId,
  };

  const followExists = await Follow.find(followToCreate);

  if (followExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is already following user ${req.params.userId}`,
        400
      )
    );
  }

  const follow = await Follow.create(followToCreate);

  res.status(201).json({ success: true, data: follow });
});

// @desc        Unfollow user
// @route       DELETE /api/follows/:id
// @access      Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const follow = await Follow.findById(req.params.id);

  if (!follow) {
    return next(
      new ErrorResponse(`Follow not found with id ${req.params.id}`, 404)
    );
  }

  await follow.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
