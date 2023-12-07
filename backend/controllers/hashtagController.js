const Hashtag = require('../models/hashtagModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get trending hashtags within 7 days
// @route       GET /api/hashtags
// @access      Public
exports.getTrendingHashtags = asyncHandler(async (req, res, next) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const hashtags = await Hashtag.find({ createdAt: { $gte: sevenDaysAgo } })
    .sort('-count')
    .limit(10);

  res
    .status(200)
    .json({ success: true, count: hashtags.length, data: hashtags });
});
