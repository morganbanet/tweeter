const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/commentModel');
const likeRouter = require('./likeRoutes');
const { protect, checkOwnership } = require('../middleware/authMiddleware');

const {
  getComments,
  getCommentUsers,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

router.use('/:commentId/likes', likeRouter);

// prettier-ignore
router.route('/')
  .get(getComments)
  .post(protect, createComment);

// prettier-ignore
router.route('/users')
  .get(getCommentUsers)

// prettier-ignore
router.route('/:id')
  .patch(protect, checkOwnership(Comment), updateComment)
  .delete(protect, checkOwnership(Comment), deleteComment)

module.exports = router;
