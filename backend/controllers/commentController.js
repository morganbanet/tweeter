const User = require('../models/userModel');
const Tweet = require('../models/tweetModel');
const Follow = require('../models/followModel');
const Comment = require('../models/commentModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const advancedResults = require('../utils/advancedResults');
const { uploadFile } = require('../utils/storageBucket');
const { createHashtags, removeHashtags } = require('../utils/hashtagHelper');

// @desc        Get comments for a tweet
// @route       GET /api/tweets/:tweetId/comments
// @access      Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  const options = {
    altQuery: { tweet: req.params.tweetId },
    populate: 'user',
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

// @desc        Get comment users
// @route       GET /api/tweets/:tweetId/comments/users
// @access      Public
exports.getCommentUsers = asyncHandler(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  const comments = await Comment.find({ tweet: req.params.tweetId });

  // show a user only once in this list
  let userIdsSet = new Set();
  comments.forEach((comment) => userIdsSet.add(comment.user._id));
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

// @desc        Create comment
// @route       POST /api/tweets/:tweetId/comments
// @access      Private
exports.createComment = asyncHandler(async (req, res, next) => {
  req.body.tweet = req.params.tweetId;
  req.body.user = req.user.id;

  const tweet = await Tweet.findById(req.params.tweetId);

  if (!tweet) {
    return next(
      new ErrorResponse(`Tweet not found with id ${req.params.tweetId}`, 404)
    );
  }

  // If tweet is private, allow comments only from users author follows
  if (tweet.private && tweet.user.toString() !== req.user.id) {
    const isBeingFollowed = await Follow.find({
      user: tweet.user,
      following: req.user.id,
    });

    if (isBeingFollowed.length === 0) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} not followed by tweet author ${tweet.user}`,
          401
        )
      );
    }
  }

  // Mark comment privacy same as parent tweet
  req.body.private = tweet.private;

  let comment = await Comment.create(req.body);

  await tweet.modifyCount('commentCount', +1);

  const hashtags = req.body.text.match(/#\w+/g);
  if (hashtags) comment = await createHashtags(hashtags, comment);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, comment, 'image', 'comments');
  }

  comment = await Comment.findById(comment.id).populate('user');

  res.status(201).json({ success: true, data: comment });
});

// @desc        Update comment
// @route       PATCH /api/comments/:id
// @access      Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    text: req.body.text,
  };

  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id ${req.params.id}`, 404)
    );
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    runValidators: true,
    new: true,
  });

  comment = await removeHashtags(comment);
  const hashtags = fieldsToUpdate.text.match(/#\w+/g);
  if (hashtags) comment = await createHashtags(hashtags, comment);

  if (req.files) {
    file = req.files.file;
    await uploadFile(file, comment, 'image', 'comments');
  }

  res.status(200).json({ success: true, data: comment });
});

// @desc        Delete comment
// @route       DELETE /api/comments/:id
// @access      Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id ${req.params.id}`, 404)
    );
  }

  const tweet = await Tweet.findById(comment.tweet);

  await comment.deleteOne();

  await tweet.modifyCount('commentCount', -1);

  res.status(200).json({ success: true, data: {} });
});
