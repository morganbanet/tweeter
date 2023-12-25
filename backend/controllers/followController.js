const User = require('../models/userModel');
const Follow = require('../models/followModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');

// @desc        Get user followers
// @route       GET /api/users/:userId/follows/followers
// @access      Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { following: req.params.userId },
    populate: 'user',
  };

  const result = await advancedResults(req, Follow, options);
  const { pagination, results: followers } = result;

  res.status(200).json({
    success: true,
    count: followers.length,
    pagination,
    data: followers,
  });
});

// @desc        Get user following
// @route       GET /api/users/:userId/follows/following
// @access      Public
exports.getFollowing = asyncHandler(async (req, res, next) => {
  const altQuery = { user: req.params.userId };

  const result = await advancedResults(req, Follow, altQuery, 'following');
  const { pagination, results: following } = result;

  res.status(200).json({
    success: true,
    count: following.length,
    pagination,
    data: following,
  });
});

// @desc        Follow user
// @route       POST /api/users/:userId/follows
// @access      Private
exports.followUser = asyncHandler(async (req, res, next) => {
  const userToFollow = await User.findById(req.params.userId);

  if (!userToFollow) {
    return next(
      new ErrorResponse(`User not found with id ${req.params.userId}`, 404)
    );
  }

  const followToCreate = {
    user: req.user.id,
    following: req.params.userId,
  };

  if (req.user.id === req.params.userId) {
    return next(new ErrorResponse(`Cannot follow user ${req.params.userId}`));
  }

  const followExists = await Follow.find(followToCreate);

  if (followExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is already following user ${req.params.userId}`,
        400
      )
    );
  }

  await userToFollow.modifyCount('followerCount', +1);
  await req.user.modifyCount('followingCount', +1);

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

  const followedUser = await User.findById(follow.following);

  await followedUser.modifyCount('followerCount', -1);
  await req.user.modifyCount('followingCount', -1);

  await follow.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
