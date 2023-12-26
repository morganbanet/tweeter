const Hashtag = require('../models/hashtagModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');

// @desc        Get trending hashtags within 7 days
// @route       GET /api/hashtags
// @access      Public
exports.getTrendingHashtags = asyncHandler(async (req, res, next) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const options = {
    altQuery: { createdAt: { gte: sevenDaysAgo } },
  };

  const result = await advancedResults(req, Hashtag, options);
  const { pagination, results: hashtags } = result;

  res.status(200).json({
    success: true,
    count: hashtags.length,
    pagination,
    data: hashtags,
  });
});
