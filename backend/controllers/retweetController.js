const Retweet = require('../models/retweetModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get retweets
// @route       GET /api/tweets/:id/retweets
// @access      Public
exports.getRetweets = asyncHandler(async (req, res, next) => {
  const retweets = await Retweet.find({ retweeted: req.params.id }).populate(
    'user'
  );

  res
    .status(200)
    .json({ success: true, count: retweets.length, data: retweets });
});

// @desc        Create retweet
// @route       POST /api/tweets/:id/retweets
// @access      Private
exports.createRetweet = asyncHandler(async (req, res, next) => {
  const retweetToCreate = {
    user: req.user.id,
    retweeted: req.params.id,
  };

  const retweetExists = await Retweet.find(retweetToCreate);

  if (retweetExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} already retweeted tweet ${req.params.id}`
      )
    );
  }

  const retweet = await Retweet.create(retweetToCreate);

  res.status(201).json({ success: true, data: retweet });
});

// @desc        Delete retweet
// @route       DELETE /api/retweets/:id
// @access      Private
exports.deleteRetweet = asyncHandler(async (req, res, next) => {
  const retweet = await Retweet.findById(req.params.id);

  if (!retweet) {
    return next(
      new ErrorResponse(`Retweet not found with id ${req.params.id}`, 404)
    );
  }

  await retweet.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
