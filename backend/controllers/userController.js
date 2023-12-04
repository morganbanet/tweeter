const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @Note: MongoDB aggregation $lookup for tweets & comments?
// - Perform aggregation: https://stackoverflow.com/questions/35795480/mongoose-query-to-get-data-from-multiple-collections

// Pass in queries for getting tweets by user, comments by user, etc?

// @desc        Get all users
// @route       GET /api/users
// @access      Public

// @desc        Get single user
// @route       GET /api/users/:id
// @access      Public

// @desc        Get tweets by user
// @route       GET /api/users/:id/tweets
// @access      Public

// @desc        Get comments by user
// @route       GET /api/users/:id/comments
// @access      Public

// @desc        Get likes by user
// @route       GET /api/users/:id/likes
// @access      Public

// @desc        Get retweets by user
// @route       GET /api/users/:id/retweets
// @access      Public

// @desc        Get bookmarks by user
// @route       GET /api/users/:id/bookmarks
// @access      Private
