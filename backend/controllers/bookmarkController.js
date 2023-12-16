const Tweet = require('../models/tweetModel');
const Bookmark = require('../models/bookmarkModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');

// @desc        Get bookmarks for a tweet
// @route       GET /api/tweets/:tweetId/bookmarks
// @access      Public
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const options = {
    altQuery: { bookmarked: req.params.tweetId },
    populate: 'user',
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

// @desc        Create bookmark
// @route       POST /api/tweets/:tweetId/bookmarks
// @access      Private
exports.createBookmark = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  const bookmarkToCreate = {
    user: req.user.id,
    bookmarked: req.params.tweetId,
  };

  const bookmarkExists = await Bookmark.find(bookmarkToCreate);

  if (bookmarkExists.length > 0) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} already bookmarked tweet ${req.params.tweetId}`,
        400
      )
    );
  }

  bookmarkToCreate.private = tweet.private;

  const bookmark = await Bookmark.create(bookmarkToCreate);

  await tweet.modifyCount('bookmarkCount', +1);

  res.status(201).json({ success: true, data: bookmark });
});

// @desc        Delete bookmark
// @route       DELETE /api/bookmarks/:id
// @access      Private
exports.deleteBookmark = asyncHandler(async (req, res, next) => {
  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    return next(
      new ErrorResponse(`Bookmark not found with id ${req.params.id}`, 404)
    );
  }

  const tweet = await Tweet.findById(bookmark.bookmarked);

  await bookmark.deleteOne();

  await tweet.modifyCount('bookmarkCount', -1);

  res.status(200).json({ success: true, data: {} });
});
