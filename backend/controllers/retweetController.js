const User = require('../models/userModel');
const Tweet = require('../models/tweetModel');
const Retweet = require('../models/retweetModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');

// @desc        Get retweets for a tweet
// @route       GET /api/tweets/:tweetId/retweets
// @access      Public
exports.getRetweets = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { retweeted: req.params.tweetId },
    populate: 'user retweeted',
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

// @desc        Get retweet users
// @route       GET /api/tweets/:tweetId/retweets/users
// @access      Public
exports.getRetweetUsers = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  const retweets = await Retweet.find({ retweeted: req.params.tweetId });

  // show a user only once in this list
  let userIdsSet = new Set();
  retweets.forEach((retweet) => userIdsSet.add(retweet.user._id));
  const userIds = Array.from(userIdsSet);

  const options = {
    altQuery: { _id: { in: userIds } },
  };

  const result = await advancedResults(req, User, options);
  const { pagination, results: users } = result;

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    data: users,
  });
});

// @desc        Create retweet
// @route       POST /api/tweets/:tweetId/retweets
// @access      Private
exports.createRetweet = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  const retweetToCreate = {
    user: req.user.id,
    retweeted: req.params.tweetId,
  };

  const retweetExists = await Retweet.find(retweetToCreate);

  if (retweetExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} already retweeted tweet ${req.params.tweetId}`,
        400
      )
    );
  }

  retweetToCreate.private = tweet.private;

  const retweet = await Retweet.create(retweetToCreate);

  await tweet.modifyCount('retweetCount', +1);

  res.status(201).json({ success: true, data: retweet });
});

// @desc        Delete retweet
// @route       DELETE /api/retweets/:id
// @access      Private
exports.deleteRetweet = asyncHandler(async (req, res, next) => {
  const retweet = await Retweet.findById(req.params.id);

  if (!retweet) {
    return next(
      new ErrorResponse(`Retweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  const tweet = await Tweet.findById(retweet.retweeted);

  await retweet.deleteOne();

  await tweet.modifyCount('retweetCount', -1);

  res.status(200).json({ success: true, data: {} });
});
