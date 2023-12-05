const Tweet = require('../models/tweetModel');
const Bookmark = require('../models/bookmarkModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc        Get bookmarks for a tweet
// @route       GET /api/tweets/:tweetId/bookmarks
// @access      Public
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const bookmarks = await Bookmark.find({
    bookmarked: req.params.tweetId,
  }).populate('user');

  res
    .status(200)
    .json({ success: true, count: bookmarks.length, data: bookmarks });
});

// @desc        Create bookmark
// @route       POST /api/tweets/:tweetId/bookmarks
// @access      Private
exports.createBookmark = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId);

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

  await bookmark.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
